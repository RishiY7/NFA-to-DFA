# NFA to DFA Converter

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![D3.js](https://img.shields.io/badge/d3%20js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)

**[🚀 Try the Live Demo Here!](https://rishiy7.github.io/NFA-to-DFA/)**

A visual tool for converting Non-Deterministic Finite Automata (NFA) to Deterministic Finite Automata (DFA). This tool provides an interactive graphical interface to visualize state transitions and understand the subset construction algorithm step-by-step.

This implementation was done by [Rishi Yadav](https://github.com/RishiY7/NFA-to-DFA).

## 🏆 Achievements

**🥇 1st Prize Winner!**  
Check out my LinkedIn post about winning first prize for this project: [View Post on LinkedIn](https://www.linkedin.com/posts/rishiyadav7_toc-theoryofcomputation-nfa-activity-7401497826871910400-SdN_?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAAFONewoBB8xsSNGZK-xZh8zB2VJnGRGgEEU)

## Features

- **Interactive Graphs**: Visualizes the NFA and DFA graphs using `d3.js` and `dagre-d3`.
- **Step-by-Step Conversion**: Displays the subset construction conversion steps clearly.
- **State Transition Tables**: Generates transition tables for both NFA and DFA.
- **Custom NFA Input**: Easily define custom states, alphabets, and transitions.

## How to Use

1. Open `index.html` in your web browser.
2. Enter your NFA configuration in the input text area. The format should be:
   - Line 1: Comma-separated list of all states (e.g., `A,B,C`)
   - Line 2: Start state (e.g., `A`)
   - Line 3: Comma-separated list of final states (e.g., `C`)
   - Subsequent Lines: Transitions in the format `FROM,SYMBOL,TO` (e.g., `A,0,A`, `A,1,B`)
3. Click **Generate NFA** to draw the NFA graph and table.
4. Click **Convert to DFA** to run the subset construction algorithm and display the DFA graph, table, and conversion steps.

## Project Structure

- `index.html`: The main markup structure.
- `style.css`: All styles, layouts, and animations.
- `script.js`: Core logic for parsing NFA, drawing graphs, and computing the DFA conversion.
- `README.md`: Project documentation.

## Technologies Used

- HTML5 & CSS3
- Vanilla JavaScript
- [D3.js](https://d3js.org/) (v7) for rendering SVGs.
- [Dagre-D3](https://github.com/dagrejs/dagre-d3) for directed graph layout.

## License

This project is licensed under the MIT License.
