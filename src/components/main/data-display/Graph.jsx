import React, { useContext, useMemo, useCallback, useState } from 'react'
import { extent, max, bisector } from 'd3-array';
import generateDateValue, { DateValue } from '@visx/mock-data/lib/generators/genDateValue';
import { MarkerArrow, MarkerCross, MarkerX, MarkerCircle, MarkerLine } from '@visx/marker';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Group } from '@visx/group';
import { LinePath, Bar, Line, stackOffset } from '@visx/shape';
import * as allCurves from '@visx/curve';
import { scaleTime, scaleLinear } from '@visx/scale';
import { AxisLeft, AxisBottom } from '@visx/axis';
import { timeFormat } from 'd3-time-format';
import { Zoom } from '@visx/zoom';

let t = -1; // init time
const n = 30; // amount of seconds to show
const duration = 750;
let initData = initialise(); //data arr

function initialise() {
    var time = -1;
    var arr = [];
    for (var i = 0; i < n; i++) {
        var obj = {
            time: ++time,
            value: Math.floor(Math.random() * 100)
        };
        arr.push(obj);
    }
    t = time;
    return arr;
}

const height = 300
const width = 800

const getX = (d) => d.time;
const getY = (d) => d.value;


const graph_offset = 25

// scales
let xScaleInit = scaleLinear({
    domain: [max(initData, getX) - n + 1, max(initData, getX)],
    range: [0, width - 3*graph_offset]
});

let yScaleInit = scaleLinear({
    domain: [0, max(initData, getY)],
    range: [height * 0.9, height * 0.1]
});

export default function Graph() {
    const curveType = 'curveLinear'
    const [graphData, setGD] = useState({lineData: initData, xScale: xScaleInit, yScale: yScaleInit});
    
    function updateData(gd) {
        t++;
        var obj = {
            time: t,
            value: Math.floor(Math.random() * 100)
        };
        gd.lineData.push(obj); // push new data into data set
        gd.xScale.domain([max(gd.lineData, getX) - n + 1, max(gd.lineData, getX)]); // update scales
        gd.yScale.domain([0, max(gd.lineData, getY)]);
        return gd
    }
    // // update scale output ranges
    // xScale.range([0, width - 3*graph_offset]);
    // yScale.range([height * 0.9, height * 0.1]);

    // const { showTooltip,
    //     tooltipData,
    //     hideTooltip,
    //     tooltipTop = 0,
    //     tooltipLeft = 0, } = useTooltip();

    // tooltip handler
    // const handleTooltip = useCallback(
    //     (event) => {
    //       let { x } = localPoint(event) || { x: (graph_offset*2) }; // x of mouse
    //       x -= (graph_offset*2)
    //       const x0 = xScale.invert(x); // maps x -> time 
    //       const index = bisectDate(allData, x0, 1); // finds index of the middle time
    //       const d0 = allData[index - 1]; 
    //       const d1 = allData[index];
    //       let d = d0;
    //       if (d1 && getX(d1)) {
    //         d = x0.valueOf() - getX(d0).valueOf() > getX(d1).valueOf() - x0.valueOf() ? d1 : d0;
    //       }
    //       showTooltip({
    //         tooltipData: d,
    //         tooltipLeft: xScale(getX(d)),
    //         tooltipTop: yScale(getY(d)),
    //       });
    //     },
    //     [showTooltip, yScale, xScale],
    //   );
  return (
        <div>
            <button onClick={() => setGD(updateData(graphData))}>this is so janky im so sorry</button>
            <svg width={width} height={height}>
                <MarkerCircle id="marker-circle" fill="#333" size={2} refX={2} />
                <rect width={width} height={height} fill="#efefef" rx={14} ry={14} />
                <Group left={graph_offset*2}>
                    {graphData.lineData.map((d, j) => (
                        <circle
                        key={j}
                        r={3}
                        cx={graphData.xScale(getX(d))}
                        cy={graphData.yScale(getY(d))}
                        stroke="rgba(33,33,33,0.5)"
                        />
                    ))}
                    {/* <rect width={width} height={height} fill="#efefef" rx={14} ry={14} /> */}
                    <AxisBottom left={0} top={height-30} scale={graphData.xScale} />
                    <AxisLeft left={0} scale={graphData.yScale} />
                    <LinePath
                    curve={allCurves[curveType]}
                    data={graphData.lineData}
                    x={(d) => graphData.xScale(getX(d)) ?? 0}
                    y={(d) => graphData.yScale(getY(d)) ?? 0}
                    stroke="#333"
                    strokeWidth={1}
                    strokeOpacity={1}
                    shapeRendering="geometricPrecision"
                    markerMid="url(#marker-circle)"
                    markerStart="url(#marker-circle)"
                    markerEnd="url(#marker-circle)"
                    />
                    <Bar
                        x={0}
                        y={0}
                        width={width}
                        height={height}
                        fill="transparent"
                        rx={14}
                    //   onTouchStart={handleTooltip}
                    //   onTouchMove={handleTooltip}
                    //   onMouseMove={handleTooltip}
                    //   onMouseLeave={() => hideTooltip()}
                    />
                    {/* {tooltipData && (
                    <Zoom>
                    {(zoom) => ( 
                    <g style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
                    ref={zoom.containerRef}>
                        <Line
                        from={{ x: tooltipLeft, y: height * 0.08 }}
                        to={{ x: tooltipLeft, y: height * 0.9}}
                        stroke="#5048E5"
                        strokeWidth={2}
                        pointerEvents="none"
                        strokeDasharray="5,2"
                        />
                        <circle
                        cx={tooltipLeft}
                        cy={tooltipTop + 1}
                        r={4}
                        fill="black"
                        fillOpacity={0.1}
                        stroke="black"
                        strokeOpacity={0.1}
                        strokeWidth={2}
                        pointerEvents="none"
                        />
                        <circle
                        cx={tooltipLeft}
                        cy={tooltipTop}
                        r={4}
                        fill="#5048E5"
                        stroke="white"
                        strokeWidth={2}
                        pointerEvents="none"
                        />
                        <div>
                        <TooltipWithBounds
                            key={Math.random()}
                            top={tooltipTop + 150}
                            left={tooltipLeft + 40}
                        >
                            {`${getY(tooltipData)}`}
                        </TooltipWithBounds>
                        </div>
                    </g>
                    )}
                    </Zoom>
                    )} */}
                </Group>
                    );
          </svg>
          {/* {tooltipData && (
            <div>
              <TooltipWithBounds
                key={Math.random()}
                top={tooltipTop + 150}
                left={tooltipLeft + 40}
              >
                {`${getY(tooltipData)}`}
              </TooltipWithBounds>
            </div>
          )} */}
        </div>
    )}