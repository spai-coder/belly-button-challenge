// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
  const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
  const resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
  const result = resultArray[0];

    // Use d3 to select the panel with id of `#sample-metadata`
  const PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
  PANEL.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
Object.entries(result).forEach(([key, value]) => {
  PANEL.append("h6").text(`${key.toUpperCase()}:${value}`);
});
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
  const samples = data.samples;

    // Filter the samples for the object with the desired sample number
  const resultArray = samples.filter(sampleObj => sampleObj.id == sample);
  const result = resultArray[0];

    // Get the otu_ids, otu_labels, and sample_values
  const otu_ids = result.otu_ids;
  const otu_labels = result.otu_labels;
  const sample_values = result.sample_values;

    // Build a Bubble Chart
  const bubbleData = [{
    x:otu_ids,
    y:sample_values,
    text:otu_labels,
    mode: 'markers',
    marker: {
      size:sample_values,
      color:otu_ids,
      colorscale: 'Earth'
    }
  }];
  const bubbleLayout = {
    title:{
      text: "Bacteria Cultures Per Sample",
      x:0.05
    },
    margin:{t:30, l:60},
    hovermode:"closest",
    xaxis: {title: "OTU ID"},
    yaxis: {title:"Number of Bacteria"},
    autosize: true,
    font:{family:"calibri"}
  };

    // Render the Bubble Chart
  Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    // Render the Bar Chart
    // Use d3 to select the dropdown with id of `#selDataset`
    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new option for each sample name.
    // Get the first sample from the list
    // Build charts and metadata panel with the first sample

  const yticks = otu_ids.slice(0,10).map(otuId => `OTU${otuId}`).reverse();
  const barData = [{
    y:yticks,
    x:sample_values.slice(0,10).reverse(),
    text:otu_labels.slice(0,10).reverse(),
    type:"bar",
    orientation: "h"
  }];

  const barLayout = {
    title: {
      text:"Top 10 Found Bacterial Cultures",
      x: 0.05
    },
    margin: {t:30, l:60},
    xaxis:{
      title: "Number of Bacteria",
      automargin: true,
      tickfont:{
        family: 'Calibri'
      }
    },
    yaxis: {
      automargin:true
    },
    font:{
      family:'Calibri'
    }
  };
  Plotly.newPlot("bar", barData, barLayout);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

  const dropdownMenu = d3.select("#selDataset");

    // Get the names field
  const sampleNames = data.names;
  sampleNames.forEach((sample)=> {
    dropdownMenu.append("option")
      .text(sample)
      .property("value", sample);
});

        const firstSample = sampleNames[0];
        buildCharts(firstSample);
        buildMetadata(firstSample);
      });
  }


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
