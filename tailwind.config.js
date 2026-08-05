module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      padding: {
        '1/2': '50%',
        'full': '100%'
      },
      colors: {
        da: {
          bg:            '#111111',
          surface:       '#1a1a1a',
          elevated:      '#222222',
          border:        '#333333',
          muted:         '#555555',
          text:          '#e8e8e8',
          subtle:        '#999999',
          green:         '#05b802',
          'green-hover': '#04a001',
          'green-dim':   '#0a4f09',
        }
      }
    },
  },
  plugins: [],
}
