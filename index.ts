type Tile = 0 | 1;
type Level = Tile[][];

const $game = $('game');
const levels: Level[] = [
    [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1],
    ],
];



$game
    // .css({
    //     'display': 'block',
    //     'height': '1000px',
    //     'width': '800px',
    //     'background': 'black',
    // });
    .append(drawLevel(levels[0]));

function drawLevel(level: Level) {
    const $level = $('<table></table>');
    level.forEach(row => {
        const $row = $('<tr></tr>')
        row.forEach(tile => {
            const $tile = $(`<td></td>`);
            switch (tile) {
                case 0:
                    $tile.attr('class', 'blank');
                    break;
                case 1:
                    $tile.attr('class', 'walkable');
                    break;
            }
            $row.append($tile);
        });
        $level.append($row);
    });
    return $level;
}