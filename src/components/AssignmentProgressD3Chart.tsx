import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ProgressDataPoint {
  week: string;
  score: number;
  completedCount: number;
  targetScore: number;
}

interface AssignmentProgressD3ChartProps {
  data?: ProgressDataPoint[];
}

const DEFAULT_PROGRESS_DATA: ProgressDataPoint[] = [
  { week: 'Tuần 1', score: 8.5, completedCount: 3, targetScore: 8.0 },
  { week: 'Tuần 2', score: 8.8, completedCount: 4, targetScore: 8.0 },
  { week: 'Tuần 3', score: 9.0, completedCount: 5, targetScore: 8.5 },
  { week: 'Tuần 4', score: 8.2, completedCount: 6, targetScore: 8.5 },
  { week: 'Tuần 5', score: 9.4, completedCount: 8, targetScore: 9.0 },
  { week: 'Tuần 6', score: 9.5, completedCount: 10, targetScore: 9.0 }
];

export const AssignmentProgressD3Chart: React.FC<AssignmentProgressD3ChartProps> = ({
  data = DEFAULT_PROGRESS_DATA
}) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Clear previous SVG contents
    d3.select(chartRef.current).selectAll('*').remove();

    const margin = { top: 30, right: 30, bottom: 40, left: 50 };
    const width = 600 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X scale
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.week))
      .range([0, width])
      .padding(0.35);

    // Y scale (0 to 10 scale)
    const y = d3
      .scaleLinear()
      .domain([0, 10])
      .range([height, 0]);

    // Grid lines
    svg
      .append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(y.ticks(5))
      .enter()
      .append('line')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => y(d))
      .attr('y2', (d) => y(d))
      .attr('stroke', '#e2e8f0')
      .attr('stroke-dasharray', '4,4');

    // X Axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('fill', '#64748b')
      .style('font-size', '11px')
      .style('font-family', 'inherit');

    // Y Axis
    svg
      .append('g')
      .call(d3.axisLeft(y).ticks(5))
      .selectAll('text')
      .attr('fill', '#64748b')
      .style('font-size', '11px')
      .style('font-family', 'inherit');

    // Gradient definition for bars
    const defs = svg.append('defs');
    const gradient = defs
      .append('linearGradient')
      .attr('id', 'bar-gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1');
    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6');

    // Bars
    svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => x(d.week) || 0)
      .attr('width', x.bandwidth())
      .attr('y', height)
      .attr('height', 0)
      .attr('fill', 'url(#bar-gradient)')
      .attr('rx', 6)
      .transition()
      .duration(800)
      .attr('y', (d) => y(d.score))
      .attr('height', (d) => height - y(d.score));

    // Target Score Line Generator
    const line = d3
      .line<ProgressDataPoint>()
      .x((d) => (x(d.week) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.targetScore))
      .curve(d3.curveMonotoneX);

    // Target line path
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#f59e0b')
      .attr('stroke-width', 2.5)
      .attr('stroke-dasharray', '5,5')
      .attr('d', line);

    // Data points on target line
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => (x(d.week) || 0) + x.bandwidth() / 2)
      .attr('cy', (d) => y(d.targetScore))
      .attr('r', 4)
      .attr('fill', '#f59e0b');

    // Score value labels on top of bars
    svg
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('x', (d) => (x(d.week) || 0) + x.bandwidth() / 2)
      .attr('y', (d) => y(d.score) - 8)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1e293b')
      .style('font-size', '10px')
      .style('font-weight', 'bold')
      .text((d) => `${d.score}đ`);

  }, [data]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Biểu Đồ Tiến Độ Hoàn Thành & Mục Tiêu Học Tập (D3.js)
          </h3>
          <p className="text-xs text-slate-500">
            Theo dõi điểm số thực tế (cột xanh) so với mục tiêu đề ra (đường cam đứt đoạn) qua các tuần
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-blue-600">
            <span className="w-3 h-3 rounded bg-blue-500 inline-block" />
            Điểm đạt được
          </span>
          <span className="flex items-center gap-1.5 text-amber-600">
            <span className="w-3 h-1 bg-amber-500 inline-block" />
            Mục tiêu (Target)
          </span>
        </div>
      </div>

      <div className="w-full h-64 flex items-center justify-center">
        <svg ref={chartRef} className="w-full h-full overflow-visible" />
      </div>
    </div>
  );
};
