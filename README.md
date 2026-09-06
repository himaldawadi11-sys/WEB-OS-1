# SpaceYatri OS

A personal web-based operating system built as my first project for Hack Club's webOS Jam / Stardance.

## What is it?

SpaceYatri OS simulates a desktop operating system inside the browser. It has a welcome screen with a launch button, and once "boarded," you land on a desktop with a top bar (including a live clock) and draggable, closable, and openable windows, just like a real OS, but built entirely with HTML, CSS, and JavaScript.

## Features

- **Welcome screen** with a custom background and a "Launch Yatri OS" launch button
- **Desktop environment** with a custom background image and a top bar showing a live clock
- **Window system**: windows can be opened, dragged around the desktop, and closed
- A working "Start" app that show recent Space News.
- I have add a additional feature that when "Escape" key is pressed the window will be close.

## How to use it

1. Open this link "https://himaldawadi11-sys.github.io/WEB-OS-1/" in your browser.
2. Click "Launch Yatri OS" on the welcome screen.
3. Once you start the OS, there is a app called "Start" which let you know about recent Space News. And there is also another app named "About Me" which gives a simple introduction about me.
4. Drag windows around by their title bar, close them with the green button or just simply click "Escape key:.

## What I struggled with

Getting the background image to properly fill the screen without stretching or cropping badly (fixed with `background-size: cover` + `min-height: 100vh`), and building a drag system for the windows that felt smooth instead of glitchy.

## What I'm proud of

Debugging the CSS sizing issue myself, and building a working drag-and-drop window system from scratch.

## Built with

HTML, CSS, JavaScript — no frameworks or libraries.
