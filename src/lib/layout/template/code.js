(function(global){

    function Layout(){
        var me = this;

        me.state = {
            width : window.innerWidth,
            height : window.innerHeight
        };
        me.data = global.getMap();
        me.graph = null;
        me.layout = null;
        me.indexMap = {};
        me.nodes = null;
        me.links = null;
        me.circles = null;
        me.texts = null;
        me.zoom = null;
        me.drag = null;
        me.dragging = false;
        me.originCurrentX = 0;
        me.originCurrentY = 0;

        me.init();
    }

    Layout.getLine

    Layout.prototype = {
        self : Layout,
        init : function(){
            var me = this;

            me.zoom = d3.behavior.zoom();

            me.layout = d3.layout.force()
                .gravity(.05)
                .charge(-300)
                .linkDistance(100);


            me.graph = d3.select(".main")
                .append("svg:svg")
                .attr("pointer-events", "all")
                .call(me.zoom)
                .append('svg:g')
                .attr('width', me.state.width)
                .attr('height', me.state.height);

            me.initData();
            me.initEvents();
            me.doLayout();

            me.resize();
            me.center();
        },
        initData : function(){
            var me = this;

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
                    return 'node' + d.internalId; 
                })
                .style("stroke-opacity",0.5);

            //Node circles
            me.circles = me.nodes.append("svg:circle")
                .attr("class", function(d) { 
                    return 'circle' + d.internalId;
                })
                .attr("r", 6);

            //Node text
            me.texts = me.nodes.append("svg:text")
                .attr("class", function(d) { 
                    return 'text' + d.internalId;
                })
                .attr("x", 15)
                .attr("y", ".31em")
                .text(function(d) { 
                    return d.id; 
                });
        },
        initEvents : function(){
            var me = this;

            $(global)
                .on("resize", function(){
                    me.resize();
                });

            $('.main')
                .draggable({ 
                    cursor: "move",
                    revert: true
                });

            $('.zin')
                .on('click',function(){
                    me.onZoomClick(0.20);
                });

            $('.zout')
                .on('click',function(){
                    me.onZoomClick(-0.20);
                });

            me.zoom
                .on("zoom", function(){
                    me.onZoomChanged();
                });

            me.circles
                .on("mouseover", function(d){
                    me.onNodeMouseOver(d);
                })
                .on("mouseout", function(d){
                    me.onNodeMouseOut(d);
                });

            me.layout
                .on("tick", function(e){
                    me.onTick(e);
                });
        },
        doLayout : function(){
            var me = this;

            // Draw the
            me.layout.nodes(me.data.nodes);
            me.layout.links(me.data.links);
            me.layout.start();

            me.zoom.scale(0.4);

            // Render transition
            me.graph.transition()
                .attr("transform", "scale(" + me.zoom.scale() + ")");
        },
        getXY : function(scale){
            var me = this;

            return [
                ((me.state.width / 2) - (me.state.width * scale / 2)),
                ((me.state.height / 2) - (me.state.height * scale / 2))
            ];
        },
        center : function(){
            var me = this;

            me.zoom.translate(me.getXY(0.2));
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
            var me = this,
                nodes = document.querySelectorAll('path.link.show');

            for (var i = nodes.length; i--; ) {
                var node = nodes[i];
                node.classList.remove('show');
            }
        },
        highlight : function(current,opacity){
            var me = this;

            me.removeHighlights();

            me.nodes.style("stroke-opacity", function(data) {
                var currentOpacity = current.links.indexOf(data.id) !== -1 || current.id === data.id ? 1 : opacity;

                this.setAttribute('fill-opacity', currentOpacity);
                this.setAttribute('stroke-opacity', currentOpacity);
                this.classList[currentOpacity === 1 ? 'remove' : 'add']('dimmed');

                return currentOpacity;
            });

            me.links.style("stroke-opacity", function(data) {
                if (current.id === data.source.id) {
                    // Highlight target/sources of the link
                    var elmNodes = me.graph.selectAll('.node'+data.id);

                    elmNodes.attr('fill-opacity', 1);
                    elmNodes.attr('stroke-opacity', 1);
                    elmNodes.classed('dimmed', false);

                    // Highlight arrows
                    var elmCurrentLink = me.graph.selectAll('.p'+data.id);

                    elmCurrentLink.attr('data-show', true);
                    elmCurrentLink.attr('marker-end', 'url(#regular)');

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
            var me = this;

            me.links
                .attr("d", function(d) {
                    return "M" + d.source.x + "," + d.source.y + "," + d.target.x + "," + d.target.y;
                });

            me.nodes
                .attr("cx", function(d) { 
                    return d.x; 
                })
                .attr("cy", function(d) { 
                    return d.y; 
                })
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
            this.highlight(current, 0.2);
        },
        onNodeMouseOut : function(current) {
            this.highlight(current, 1);
        }
    };

    return new Layout;
})(this);