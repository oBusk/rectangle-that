type Tile = 0 | 1 | 2 | 3;
type Level = Tile[][];
type Coords = { x: number, y: number };

const $game = $('game');
const levels: Level[] = [
    [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0],
        [0, 1, 1, 2, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    [
        [2, 1, 1, 1, 1],
        [1, 1, 0, 0, 1],
        [1, 1, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 2, 1, 1],
        [1, 0, 0, 1, 1],
        [1, 1, 1, 1, 1],
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 2, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 1, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    [
        [0, 0, 0, 0, 0],
        [0, 2, 1, 1, 0],
        [0, 1, 1, 0, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 1, 2, 0],
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
    ],
    // [
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0],
    // ],
];

type Field = JQuery[][];

let currentLevelNumber = 0;
let currentLevel: Level;
startLevel(currentLevelNumber);

let cells = createField(5, 8);

$game.prepend(cells.table);

applyLevelState(currentLevel, cells.arrayGrid);

function startLevel(levelNumber: number) {
    currentLevel = copyArrayGrid(levels[levelNumber]);
}

function copyArrayGrid<T>(arr: T[][]) {
    return arr.map(a => {
        return a.slice();
    })
}

function createField(width: number, height: number) {
    const arrayGrid: Field = new Array();
    const table: JQuery = $('<table></table');
    for (let y = 0; y < height; y++) {
        const row: JQuery[] = new Array();
        const rowElement: JQuery = $('<tr></tr>');
        for (let x = 0; x < width; x++) {
            const cell = $('<td></td>');
            row.push(cell);
            rowElement.append(cell);
        }
        arrayGrid.push(row);
        table.append(rowElement);
    }
    return { arrayGrid, table };
}

function applyLevelState(level: Level, elements: JQuery[][]) {
    level.forEach((row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
            let classes: string;
            switch (cell) {
                case 0:
                    classes = '';
                    break;
                case 1:
                    classes = 'walkable';
                    break;
                case 2:
                    classes = 'mover';
                    break;
                case 3:
                    classes = 'filled';
                    break;
            }
            elements[rowIndex][cellIndex].attr('class', classes);
        });
    });
}

function getIndexesOfK<T>(arr: T[][], k: T): Coords[] {
    const result: Coords[] = [];

    arr.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell === k) {
                result.push({ x, y });
            }
        });
    });

    return result;
}

function visit(from: Coords, to: Coords) {
    if (
        currentLevel[from.y] &&
        currentLevel[from.y][from.x] &&
        currentLevel[from.y][from.x] === 2 &&
        currentLevel[to.y] &&
        currentLevel[to.y][to.x] &&
        currentLevel[to.y][to.x] === 1
    ) {
        currentLevel[to.y][to.x] = 2;
        currentLevel[from.y][from.x] = 3;
    }
}

function isLevelCompleted() {
    return !currentLevel.some(row => row.some(cell => cell === 1));
}

$(document).on('keydown', (e) => {
    const moversCoords = getIndexesOfK(currentLevel, 2);
    console.log(moversCoords);

    switch (e.keyCode) {
        case 87: // w
        case 38: // ↑
            moversCoords.forEach(moverCoord => {
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x, y: moverCoord.y - 1 });
            });
            break;
        case 68: // d
        case 39: // →
            moversCoords.forEach(moverCoord => {
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x + 1, y: moverCoord.y });
            });
            break;
        case 83: // s
        case 40: // ↓
            moversCoords.forEach(moverCoord => {
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x, y: moverCoord.y + 1 });
            });
            break;
        case 65: // a
        case 37: // ←
            moversCoords.forEach(moverCoord => {
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x - 1, y: moverCoord.y });
            });
            break;
        case 82: // r
            startLevel(currentLevelNumber); // RESET CURRENT LEVEL
            break;
    }

    applyLevelState(currentLevel, cells.arrayGrid);

    if (isLevelCompleted()) {
        const newLevelNumber = currentLevelNumber + 1;
        if (levels[newLevelNumber]) {
            startLevel(++currentLevelNumber);
            applyLevelState(currentLevel, cells.arrayGrid);
        } else {
            alert('CONGRATS');
        }
    }
});