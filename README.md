# Neelansh Khare - Interactive Portfolio

An interactive 3D portfolio website built with Three.js that showcases my skills, experience, and projects in an engaging way.

## Features

- Interactive 3D visualization of portfolio data
- Particle system with dynamic animations
- Interactive camera controls (rotate, zoom)
- Responsive design for desktop and mobile
- Sleek, modern UI with smooth transitions

## Technologies Used

- HTML5, CSS3, JavaScript
- Three.js for 3D visualization
- Custom WebGL shaders for particle effects

## Setup and Deployment

### Local Development

1. Clone the repository:
   ```
   git clone https://github.com/Neelansh-Khare/portfolio.git
   cd portfolio
   ```

2. You can use a simple local server to preview the website:
   - If you have Python installed:
     ```
     # For Python 3
     python -m http.server

     # For Python 2
     python -m SimpleHTTPServer
     ```
   - If you have Node.js installed:
     ```
     npx serve
     ```

3. Open your browser and navigate to `http://localhost:8000` (or whichever port your server provides)


## Customization

To customize the portfolio with your own information:

1. Edit the portfolio data in `js/three-portfolio.js` - look for the `portfolioData` object
2. Update content in `index.html` for sections (About, Experience, Projects, Skills, Contact)
3. Modify colors and styling in `css/styles.css`

## License

MIT License
