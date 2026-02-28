# Project 1: Data Chase

## Team
- Ray Hernaez
- Yann Kruplewicz
- Zhuoheng Yang

## Project Link
- [Play it Here](https://sleepyrayray.github.io/project-1/)

## Description
A 2-player chase game made with **JavaScript + HTML Canvas**.  
One player is the **Police** and the other is the **Data Thief**. The thief must collect all data collectibles in the maze, while the police tries to catch them first.

## How to Play
- **Goal (Thief):** collect all data items without getting caught
- **Goal (Police):** catch the thief before all items are collected
- **Speed Boost:** when the thief collects a data item, they gain **+30 speed for 3 seconds**
- **Teleportation:** if the police touches a collectible, the police **teleports to a random path tile**

## Controls
- Police: `W A S D`
- Thief: Arrow keys

## Tech / Features
- HTML Canvas rendering (2D context)
- Tile-based maze map (walls vs paths)
- Object-oriented structure:
  - `TileMap` handles the map + wall checks
  - `Player` handles player state + movement
  - `Collectible` handles pickups
  - `Game` runs the loop (update/draw)
  - `Police` and `Thief` handle character visuals/animation
- Random collectible spawning on valid path tiles (no wall spawns)
- Background music (starts on first click)