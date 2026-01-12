import { Component, inject, ElementRef, ViewChild, AfterViewInit, effect } from '@angular/core';
import { StoreService } from '../services/store.service.ts';
import { CommonModule } from '@angular/common';

declare const d3: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
      <div class="flex items-center justify-between">
         <h2 class="text-2xl font-bold text-slate-800">Dashboard Overview</h2>
         <span class="text-xs font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Live Data</span>
      </div>
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <p class="text-xs font-bold uppercase tracking-wider text-slate-400">Total Orders</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-3xl font-bold text-slate-800">{{ store.stats().total }}</p>
            <span class="text-xs text-slate-400">orders</span>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm bg-emerald-50/30 hover:shadow-md transition-shadow">
          <p class="text-xs font-bold uppercase tracking-wider text-emerald-600">Calls Made</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-3xl font-bold text-emerald-700">{{ store.stats().called }}</p>
             <span class="text-xs text-emerald-500">completed</span>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm bg-orange-50/30 hover:shadow-md transition-shadow">
          <p class="text-xs font-bold uppercase tracking-wider text-orange-600">Pending</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-3xl font-bold text-orange-700">{{ store.stats().pending }}</p>
            <span class="text-xs text-orange-500">to call</span>
          </div>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-teal-100 shadow-sm bg-teal-50/30 hover:shadow-md transition-shadow">
          <p class="text-xs font-bold uppercase tracking-wider text-teal-600">Approved</p>
          <div class="flex items-baseline gap-2 mt-2">
            <p class="text-3xl font-bold text-teal-700">{{ store.stats().approved }}</p>
            <span class="text-xs text-teal-500">verified</span>
          </div>
        </div>
      </div>

      <!-- Charts Area -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <!-- Pie Chart -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden">
          <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400"></div>
          <h3 class="text-lg font-semibold text-slate-800 mb-4 w-full text-left flex items-center gap-2">
            <span class="w-2 h-6 bg-emerald-500 rounded-full"></span>
            Call Status
          </h3>
          <div class="flex justify-center h-64 w-full relative" #pieChartContainer></div>
        </div>

        <!-- Bar Chart -->
        <div class="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center relative overflow-hidden">
           <div class="absolute top-0 w-full h-1 bg-gradient-to-r from-teal-400 to-cyan-400"></div>
           <h3 class="text-lg font-semibold text-slate-800 mb-4 w-full text-left flex items-center gap-2">
            <span class="w-2 h-6 bg-teal-500 rounded-full"></span>
            Activity Timeline
           </h3>
           <div class="flex justify-center h-64 w-full relative" #barChartContainer></div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit {
  store = inject(StoreService);
  @ViewChild('pieChartContainer') pieContainer!: ElementRef;
  @ViewChild('barChartContainer') barContainer!: ElementRef;

  constructor() {
    effect(() => {
      const stats = this.store.stats();
      setTimeout(() => {
        this.renderPieChart();
        this.renderBarChart();
      }, 100);
    });
  }

  ngAfterViewInit() {
    this.renderPieChart();
    this.renderBarChart();
  }

  renderPieChart() {
    if (!this.pieContainer) return;
    const element = this.pieContainer.nativeElement;
    element.innerHTML = '';

    const stats = this.store.stats();
    if (stats.total === 0) return;

    const data = [
      { label: 'Called', value: stats.called },
      { label: 'Pending', value: stats.pending }
    ];

    const width = 300;
    const height = 250;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Using Emerald and Orange theme
    const color = d3.scaleOrdinal()
      .domain(['Called', 'Pending'])
      .range(['#10b981', '#fb923c']); // Emerald-500, Orange-400

    const pie = d3.pie().value((d: any) => d.value);
    const data_ready = pie(data);

    const arcGenerator = d3.arc().innerRadius(60).outerRadius(radius);

    svg.selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', arcGenerator)
      .attr('fill', (d: any) => color(d.data.label))
      .attr('stroke', 'white')
      .style('stroke-width', '4px')
      .style('opacity', 0.9);

    svg.selectAll('mySlices')
      .data(data_ready)
      .enter()
      .append('text')
      .text((d: any) => d.data.value > 0 ? `${d.data.label}` : '')
      .attr('transform', (d: any) => `translate(${arcGenerator.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', 12)
      .style('font-weight', 'bold')
      .style('fill', 'white');
  }

  renderBarChart() {
    if (!this.barContainer) return;
    const element = this.barContainer.nativeElement;
    element.innerHTML = '';

    const feedbackList = this.store.feedbackList();
    if (feedbackList.length === 0) return;

    const counts: {[key:string]: number} = {};
    feedbackList.forEach(f => {
      counts[f.dateOfDelivery] = (counts[f.dateOfDelivery] || 0) + 1;
    });
    
    const data = Object.keys(counts)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => ({ date, value: counts[date] }));

    const margin = {top: 20, right: 20, bottom: 40, left: 40};
    const width = 400 - margin.left - margin.right;
    const height = 250 - margin.top - margin.bottom;

    const svg = d3.select(element)
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .domain(data.map(d => d.date))
      .padding(0.3);
    
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-15)")
        .style("fill", "#64748b");

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d:any) => d.value) || 5])
      .range([height, 0]);
    
    svg.append("g")
      .call(d3.axisLeft(y).ticks(5))
      .style("color", "#94a3b8");

    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", (d: any) => x(d.date))
        .attr("y", (d: any) => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", (d: any) => height - y(d.value))
        .attr("fill", "#0d9488") // Teal-600
        .attr("rx", 4);
  }
}