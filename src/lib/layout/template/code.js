(function(global){

    if (!global.jQuery || !global.d3) {
        alert('Error while loading libraries. Try again.');

        throw new Error('External libraries not found.');
    }

    function Layout(){
        var me = this;

        $.extend(me,{
             state : {
                width : window.innerWidth,
                height : window.innerHeight
            },
            offset : {
                x : 0,
                y : 0
            },
            data : global.getMap(),
            graph : null,
            layout : null,
            indexMap : {},
            nodes : null,
            links : null,
            circles : null,
            texts : null,
            zoom : null,
            $main : $('.main'),
            $pathLinks : null,
            $zin : $('.zin'),
            $zout : $('.zout'),
            $global : $(global)
        });

        me.init();
    }

    Layout.DEFAULTS = {
        SCALE : 2.0,
        LINK_DISTANCE_FACTOR : 3,
        ZOOM_IN_FACTOR : 0.20,
        ZOOM_OUT_FACTOR : -0.20,
        HIGHLIGHT_SHOW_OPACITY : 1,
        HIGHLIGHT_HIDE_OPACITY : 0.2
    };

    Layout.collide = function(node) {
        var r = node.radius + 16,
            nx1 = node.x - r,
            nx2 = node.x + r,
            ny1 = node.y - r,
            ny2 = node.y + r;

        return function(quad, x1, y1, x2, y2) {
            if (quad.point && (quad.point !== node)) {
                var x = node.x - quad.point.x,
                    y = node.y - quad.point.y,
                    l = Math.sqrt(x * x + y * y),
                    r = node.radius + quad.point.radius;

                if (l < r) {
                    l = (l - r) / l * .5;
                    node.x -= x *= l;
                    node.y -= y *= l;
                    quad.point.x += x;
                    quad.point.y += y;
                }
            }
            return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        };
    }

    Layout.touchHandler = function(e){
        var touch = event.changedTouches[0],
            simulatedEvent = document.createEvent("MouseEvent");

        simulatedEvent.initMouseEvent({
            touchstart: "mousedown",
            touchmove: "mousemove",
            touchend: "mouseup"
        }[event.type], true, true, window, 1,
            touch.screenX, touch.screenY,
            touch.clientX, touch.clientY, false,
            false, false, false, 0, null);

        touch.target.dispatchEvent(simulatedEvent);
        event.preventDefault();
    };

    $.extend(Layout.prototype,{
        self : Layout,
        init : function(){
            var me = this;

            me.zoom = d3.behavior.zoom();
            me.layout = d3.layout.force();

            me.render();
            me.initEvents();
            me.doLayout();

            me.resize();
            me.center();
        },
        render : function(){
            var me = this;

            //Graph
            me.graph = d3.select(".main")
                .append("svg:svg")
                .attr("pointer-events", "all")
                .call(me.zoom)
                .append('svg:g')
                .attr('width', me.state.width)
                .attr('height', me.state.height);

            //Markers
            me.graph.append("svg:defs").selectAll("marker")
                .data(['regular'])
                .enter().append("svg:marker")
                .attr("id", String)
                .attr("viewBox", "0 -5 10 10")
                .attr("refX", 15)
                .attr("refY", -1.5)
                .attr("markerWidth", 6)
                .attr("markerHeight", 6)
                .attr("orient", "auto")
                .append("svg:path")
                .attr("d", "M0,-5L10,0L0,5");

            //Lines
            me.links = me.graph.append('svg:g').selectAll("line")
                .data(me.data.links)
                .enter().append("svg:path")
                .attr("class", function(d) { 
                    return 'link p' + d.internalId; 
                })
                .attr("data-target", function(d) { 
                    return d.target;
                })
                .attr("data-source", function(d) { 
                    return d.source;
                });

            //Nodes
            me.nodes = me.graph.append('svg:g').selectAll("node")
                .data(me.data.nodes)
                .enter().append("svg:g")
                .attr("class","node")
                .call(me.layout.drag)
                .attr("class", function(d) { 
                    return 'node node' + d.internalId; 
                })
                .style("stroke-opacity",0.5);

            //Node circles
            me.circles = me.nodes.append("svg:circle")
                .attr("class", function(d) { 
                    return 'circle circle' + d.internalId;
                })
                .attr("r", function(d) { 
                    return me.getCircleSize(d.links.length);
                });

            //Node text
            me.texts = me.nodes.append("svg:text")
                .attr("class", function(d) { 
                    return 'text text' + d.internalId;
                })
                .attr("x", function(d){
                    return me.getCircleSize(d.links.length) + 2;
                })
                .attr("y", ".31em")
                .text(function(d) { 
                    return d.text; 
                });
        },
        initEvents : function(){
            var me = this;

            me.$global
                .on("resize", me.resize.bind(me));

            me.$main
                .css('cursor','move')
                .mousedown(me.onMousedown.bind(me,me.$main))
                .mousemove(me.onMousemove.bind(me,me.$main))
                .mouseup(me.onMouseup.bind(me,me.$main));

            me.$zin
                .on('click',me.onZoomClick.bind(me,me.self.DEFAULTS.ZOOM_IN_FACTOR));

            me.$zout
                .on('click',me.onZoomClick.bind(me,me.self.DEFAULTS.ZOOM_OUT_FACTOR));

            me.zoom
                .on("zoom", me.onZoomChanged.bind(me));

            me.circles
                .on("mouseover", me.onNodeMouseOver.bind(me))
                .on("mouseout", me.onNodeMouseOut.bind(me));

            me.layout
                .on("tick", me.onTick.bind(me));


        },
        doLayout : function(){
            var me = this;

            // Draw the
            me.layout
                .links(me.data.links)
                .nodes(me.data.nodes)
                .charge(-120)
                .linkDistance(function(d){
                    return d.source.links.length * me.self.DEFAULTS.LINK_DISTANCE_FACTOR;
                })
                .size([me.state.width,me.state.height])
                .start();

            me.$pathLinks = $('path.link');

            me.zoom.scale(me.self.DEFAULTS.SCALE);

            $( document ).tooltip({
                items: '.node',
                track: true,
                content: function() {
                    var output = ['<ul>'];

                    $.each(this.__data__.data,function(key,value){
                        output.push('<li><label>' + key + ':</label> <span>' + value + '</span></li>');
                    });

                    output.push('</ul>');
                    return output.join('');
                }
            });

            // Render transition
            me.graph.transition()
                .attr("transform", "scale(" + me.zoom.scale() + ")");
        },
        getCircleSize : function(length){
            return 2 + 0.5 * length;
        },
        getXY : function(scale){
            var me = this;

            return [
                ((me.state.width / 2) - (me.state.width * scale / 2)) + me.offset.x,
                ((me.state.height / 2) - (me.state.height * scale / 2)) + me.offset.y
            ];
        },
        center : function(){
            var me = this;

            me.zoom.translate(me.getXY(me.zoom.scale()));
            me.graph.transition()
                .attr("transform", "translate(" + me.zoom.translate() + ")" + " scale(" + me.zoom.scale() + ")");
        },
        resize : function(){
            var me = this;

            me.state.width = global.innerWidth;
            me.state.height = global.innerHeight;

            me.graph
                .attr("width", me.state.width)
                .attr("height", me.state.height);

            me.layout
                .size([me.state.width, me.state.height])
                .resume();
        },
        removeHighlights : function(){
            this.$pathLinks.filter('.show').removeClass('show');
        },
        highlight : function(current,opacity){
            var me = this;

            me.removeHighlights();

            me.nodes.style("stroke-opacity", function(data) {
                var currentOpacity = current.links.indexOf(data.id) !== -1 || current.id === data.id ? 1 : opacity,
                    node = $(this);

                node
                    .attr('fill-opacity', currentOpacity)
                    .attr('stroke-opacity', currentOpacity)
                    [currentOpacity === 1 ? 'removeClass' : 'addClass']('dimmed');

                return currentOpacity;
            });

            me.links.style("stroke-opacity", function(data) {
                if (current.id === data.source.id) {
                    // Highlight target/sources of the link
                    var elmNodes = me.graph.selectAll('.node'+data.id);

                    elmNodes
                        .attr('fill-opacity', 1)
                        .attr('stroke-opacity', 1)
                        .classed('dimmed', false);

                    // Highlight arrows
                    var elmCurrentLink = me.graph.selectAll('.p'+data.id);

                    elmCurrentLink
                        .attr('data-show', true)
                        .attr('marker-end', 'url(#regular)');

                    return 1;
                }

                return opacity;
            });
        },
        setZoom : function(scale){
            var me = this;

            me.zoom
                .translate(me.getXY(scale))
                .scale(scale);

            me.graph.transition()
                .attr("transform", "translate(" + me.zoom.translate() + ")" + " scale(" + me.zoom.scale() + ")");
        },
        onTick : function(e) {
            var me = this,
                q = d3.geom.quadtree(me.nodes);

            for (var index = 0, length = me.nodes.length; index < length; index++) {
                q.visit(me.self.collide(me.nodes[index]));
            }

            me.links
                .attr("d", function(d) {
                    return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
                });

            me.nodes
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")"; 
                });
        },
        onZoomClick : function(scale){
            var me = this,
                currentScale = me.zoom.scale(),
                newScale = Math.max(currentScale * (1 + scale), 0);

            me.setZoom(newScale);
        },
        onZoomChanged : function(){
            var me = this;

            me.onZoomClick(me.zoom.scale() - d3.event.scale);
        },
        onNodeMouseOver : function(current) {
            this.highlight(current, this.self.DEFAULTS.HIGHLIGHT_HIDE_OPACITY);
        },
        onNodeMouseOut : function(current) {
            this.highlight(current, this.self.DEFAULTS.HIGHLIGHT_SHOW_OPACITY);
        },
        onMousemove : function($drag,e){
            var me = this;

            if (me.dragging) {
                me.offset.x = e.pageX + me.dragX - me.dragWidth;
                me.offset.y = e.pageY + me.dragY - me.dragHeight;
                me.center();
            }
        },
        onMousedown : function($drag,e){
            var me = this;

            me.dragging = true;
            me.dragWidth = $drag.outerWidth();
            me.dragHeight = $drag.outerHeight();
            me.dragX = me.offset.x + me.dragWidth - e.pageX;
            me.dragY = me.offset.y + me.dragHeight - e.pageY;

            e.preventDefault();
        },
        onMouseup : function($drag,e){
             this.dragging = false;
        }
    });

    return new Layout;
})(this);