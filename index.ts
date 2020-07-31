type Tile = 0 | 1 | 2 | 3;
type Level = Tile[][];
type Coords = { x: number, y: number };

const $game = $('game');
const levels: { background: string; level: Level }[] = [
    {
        background: 'linear-gradient(to left, #56ab2f , #a8e063)',
        level: [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0],
            [0, 1, 1, 2, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ],
    },
    {
        background: 'linear-gradient(to left, #4568DC , #B06AB3)',
        level: [
            [2, 1, 1, 1, 1],
            [1, 1, 0, 0, 1],
            [1, 1, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 0, 0, 1],
            [1, 0, 2, 1, 1],
            [1, 0, 0, 1, 1],
            [1, 1, 1, 1, 1],
        ],
    },
    {
        background: 'linear-gradient(to left, #3a6186 , #89253e)',
        level: [
            [0, 0, 0, 0, 0],
            [0, 2, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0],
            [0, 0, 1, 2, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ],
    },
    {
        background: 'linear-gradient(to left, #4DA0B0 , #D39D38)',
        level: [
            [0, 0, 0, 0, 0],
            [0, 2, 1, 1, 0],
            [0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0],
            [0, 0, 1, 0, 0],
            [0, 0, 1, 2, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
        ],
    }
    // level: [
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
    $('html').css('background', levels[levelNumber].background);
    currentLevel = copyArrayGrid(levels[levelNumber].level);
}

function copyArrayGrid<T>(arr: T[][]) {
    return arr.map(a => {
        return a.slice();
    });
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
            let html: string;
            switch (cell) {
                case 0:
                    classes = '';
                    html = '';
                    break;
                case 1:
                    classes = 'walkable';
                    html = '';
                    break;
                case 2:
                    classes = 'mover';
                    html = '○';
                    break;
                case 3:
                    classes = 'filled';
                    html = '';
                    break;
            }
            elements[rowIndex][cellIndex]
                .attr('class', classes)
                .html(html);
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

function move(direction: 'up' | 'right' | 'down' | 'left') {
    const moversCoords = getIndexesOfK(currentLevel, 2);

    moversCoords.forEach(moverCoord => {
        switch (direction) {
            case 'up':
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x, y: moverCoord.y - 1 });
                break;
            case 'right':
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x + 1, y: moverCoord.y });
                break;
            case 'down':
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x, y: moverCoord.y + 1 });
                break;
            case 'left':
                visit({ x: moverCoord.x, y: moverCoord.y }, { x: moverCoord.x - 1, y: moverCoord.y });
                break;
            default:
                throw 'unexpected direction';
        }
    });
}

function reset() {
    startLevel(currentLevelNumber); // RESET CURRENT LEVEL
}

function update() {
    applyLevelState(currentLevel, cells.arrayGrid);

    if (isLevelCompleted()) {
        const newLevelNumber = currentLevelNumber + 1;
        if (levels[newLevelNumber]) {
            setTimeout(() => {
                cells.table.addClass('completed');
                setTimeout(() => {
                    startLevel(++currentLevelNumber);
                    applyLevelState(currentLevel, cells.arrayGrid);
                    cells.table.removeClass('completed');
                }, 650);
            }, 750);
        } else {
            alert('CONGRATS');
        }
    }
}

$(document)
    .on('keyup', (e) => {

        switch (e.keyCode) {
            case 87: // w
            case 38: // ↑
                move('up');
                break;
            case 68: // d
            case 39: // →
                move('right');
                break;
            case 83: // s
            case 40: // ↓
                move('down');
                break;
            case 65: // a
            case 37: // ←
                move('left');
                break;
            case 82: // r
                reset();
                break;
            default:
                return; // None of the supported keys were pressed, dont continue
        }

        update();
    });

let touchStartPosition: { x: number, y: number };
let lastTouchMovePosition: { x: number, y: number };

$(document)
    .on('touchstart', (e: any) => {
        touchStartPosition = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
    })
    .on('touchmove', (e: any) => {
        lastTouchMovePosition = { x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY };
    })
    .on('touchend', (e: any) => {
        const minSwipeDistance = 48;

        const delta = {
            x: lastTouchMovePosition ? lastTouchMovePosition.x - touchStartPosition.x : 0,
            y: lastTouchMovePosition ? lastTouchMovePosition.y - touchStartPosition.y : 0,
        };

        console.log(delta);

        if (Math.abs(delta.x) < minSwipeDistance && Math.abs(delta.y) < minSwipeDistance) {
            if (e.changedTouches[0].target.id === 'reset-button') {
                reset();
            } else {
                // neither of the horizontal or vertical was long enough
                return;
            }
        } else if (Math.abs(delta.x) > Math.abs(delta.y)) {
            // move horizontally
            move(delta.x < 0 ? 'left' : 'right');
        } else {
            // move vertically
            move(delta.y < 0 ? 'up' : 'down');
        }

        lastTouchMovePosition = undefined;

        update();
    });

// $('#reset-button').on('mouseup', e => {
//     e.stopPropagation();
//     reset();
// })
