const ChartSchema = new Schema({
    equationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equations', required: true },
    chartData: [{
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      z: { type: Number },  //For 3D charts
      label: { type: String },
      color: { type: String }
    }],
    chartType: {
      type: String,
      enum: ['line', 'bar', 'scatter', 'pie', 'heatmap', '3d', 'histogram'],
      required: true
    },
    equation: { type: String },  // Raw function
    title: { type: String },  // Title
    xAxisLabel: { type: String },
    yAxisLabel: { type: String },
    zAxisLabel: { type: String },  // For 3D charts
    is3D: { type: Boolean, default: false },
    chartImageUrl: { type: String },
    version: { type: Number, default: 1 },
    createdAt: { type: Date, default: Date.now, index: true },
  });
  
  const Chart = mongoose.model('Charts', ChartSchema);
  module.exports = Chart;
  