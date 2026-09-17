# SpaceYatri OS

A personal space-themed web operating system built for Hack Club's WebOS Jam / Stardance.

## What is it?

**SpaceYatri OS** is a web-based operating system simulation that runs directly in your browser. It is designed to feel like a small desktop environment while being built entirely with **HTML, CSS, and JavaScript**.

The project combines a space-themed interface with interactive windows, customization options, utilities, and a launch sequence inspired by a spacecraft startup.

## Features

* **Rocket Launch Boot Sequence**

  * Ignition countdown
  * Rocket launch animation
  * Smoke and launch effects
  * Welcome sequence before entering the desktop

* **Desktop Environment**

  * Space-themed desktop
  * Top bar with live clock
  * Desktop applications and widgets
  * Space-themed visual design

* **Window System**

  * Open and close windows
  * Drag windows around the desktop
  * Close windows using the close button
  * Press `Escape` to close the active window

* **DECK Settings**

  * Wallpaper selection
  * Theme customization
  * Accent color selection
  * Master volume controls
  * Mute option
  * Brightness control
  * Transparency settings

* **SpaceFeed**

  * Live space news feed using the Spaceflight News API
  * Like space news posts
  * Likes are saved locally and persist after refreshing
  * Add comments to posts
  * Comments are saved locally and persist after refreshing
  * Friendly fallback message when news cannot be loaded

* **Calculator**

  * Built-in calculator application for basic calculations

* **Clock Widget**

  * Analog clock
  * Digital time display
  * Space-themed interface

* **Additional Utilities**

  * Wi-Fi status popup
  * Brightness popup
  * Fuel indicator
  * Toast notifications
  * Interactive alien companion

## SpaceFeed

The **SpaceFeed** app provides a live stream of space-related news instead of using static content.

It fetches current articles from the **Spaceflight News API** and allows users to interact with the posts.

### SpaceFeed features

* Fetches up-to-date space news
* Like posts
* Add comments
* Likes and comments persist after refreshing the page
* Uses local browser storage for user interactions
* Displays a fallback message if the news feed cannot be loaded

> **Note:** Likes and comments are stored locally in the visitor's browser. They are not shared between different users.

## How to use it

1. Open the SpaceYatri OS website in your browser.
2. Start the launch sequence.
3. Wait for the rocket launch animation to finish.
4. Explore the desktop and open the available applications.
5. Open **DECK** to customize the system.
6. Open **SpaceFeed** to explore the latest space news.
7. Try dragging and closing windows.
8. Press `Escape` to close the active window.

## What I struggled with

One of the biggest challenges was combining many interactive features into a single web-based operating system.

I worked on:

* Creating a reliable boot and launch sequence
* Making the desktop work correctly with different screen sizes
* Building draggable windows
* Managing multiple applications
* Connecting the SpaceFeed app to a live API
* Saving likes and comments using browser storage
* Building the settings system without making the interface too complicated

## What I'm proud of

I'm proud that I was able to build a complete interactive web OS from scratch and keep expanding it with new features.

I especially enjoyed building the **rocket launch sequence**, the **SpaceFeed system**, and the **DECK customization panel**.

This project also helped me understand how different parts of HTML, CSS, and JavaScript can work together to create something that feels like a real application.

## Built with

* **HTML**
* **CSS**
* **JavaScript**
* **Spaceflight News API**
* **Browser Local Storage**

No frameworks or libraries were used for the core operating system.

## Project

**SpaceYatri OS**
Built for **Hack Club's WebOS Jam / Stardance**.

> Exploring beyond!
