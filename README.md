# Project 1: Data Chase

A 2-player chase game made with **JavaScript + HTML Canvas**.  
One player is the **Police** and the other is the **Data Thief**. The thief must collect all data collectibles in the maze, while the police tries to catch them first.

## How to Play
- **Goal (Thief):** collect all data items without getting caught  
- **Goal (Police):** catch the thief before all items are collected  
- **Speed Boost:** when the thief collects a data item, they get a temporary speed boost (police speed stays constant)

## Controls
- Police: `W A S D`
- Thief: Arrow keys

## Tech / Features
- HTML Canvas rendering (2D context)
- Tile-based maze map (walls vs paths)
- Object-oriented structure:
  - `TileMap` handles the map + wall checks
  - `Player` handles player state + drawing
  - `Collectible` handles pickups
  - `Game` runs the loop (update/draw)
- Random collectible spawning on valid path tiles (no wall spawns)
- Background music (starts on first click)