const gameBox = document.createElement('div');
gameBox.className = 'gameBox';
document.body.append(gameBox);

const cellSize = 100;
let finish = false;

const empty = {
    top: 0,
    left: 0,
    value: 0
};

const temp = {
    top: 0,
    left: 0
};

const cells = [];

const checkFinish = () => {
    if (cells.every(cell => {
        return cell.value === cell.top * 4 + cell.left;
    }) || cells.every(cell => {
        return cell.value === (cell.top * 4 + cell.left +1) % 16;
    })) {
        finish = true;
    } else {
        finish = false;
    }
    if (finish) {
        alert('You won');
    }
}

const move = (index) => {

    const cell = cells[index];
    const xDif = Math.abs(empty.left - cell.left);
    const yDif = Math.abs(empty.top - cell.top);
    
    if (xDif + yDif > 1) {
        return;
    }
    
    cells.forEach(el => {
        if (el.top === empty.top && el.left === empty.left) {
            el.element.style.left = `${cell.left * cellSize}px`;
            el.element.style.top = `${cell.top * cellSize}px`;
            el.left = cell.left;
            el.top = cell.top;
        }
    });
    
    cell.element.style.left = `${empty.left * cellSize}px`;
    cell.element.style.top = `${empty.top * cellSize}px`;

    const emptyLeft = empty.left;
    const emptyTop = empty.top;
    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;

    checkFinish();
}

const randomSort = (numbers) => {
    numbers.sort(() => Math.random() - 0.5);
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        for (let j = i; j < numbers.length; j++) {
            if (numbers[i] > numbers[j]) {
                sum++;
            }
        }
    }
    sum++;
    if (sum%2 === 0) {
        return numbers;
    } else {
        randomSort(numbers);
    }    
    return numbers;
}

let numbers = [];
for (let i = 1; i <= 15; i++) {
    numbers.push(i);
}
numbers = randomSort(numbers);

for (let i = 0; i <= 15; i++) {
    const cell = document.createElement('div');
    let value, left, top;
    
    if (i === 0) {
        cell.className = 'cell_empty';
        value = 0;
        left = 0;
        top = 0;
    } else {
        value = numbers[i-1];

        cell.className = 'cell';
        cell.draggable = true;
        cell.innerHTML = value;

        left = i % 4;
        top = (i - left) / 4;

    }

    cells.push({
        left: left,
        top: top,
        element: cell,
        value: value
    });

    cell.style.left = `${left * cellSize}px`;
    cell.style.top = `${top * cellSize}px`;
    
    gameBox.append(cell);

    cell.addEventListener('click', () => {
        move(i);
    });

}

const eCellEmpty = gameBox.querySelector('.cell_empty');
const eCells = gameBox.querySelectorAll('.cell');

gameBox.addEventListener('dragstart', (evt) => {
    evt.target.classList.add('selected');
})
gameBox.addEventListener('dragend', (evt) => {
    evt.target.classList.remove('selected');
})
gameBox.addEventListener('dragover', (evt) => {
    evt.preventDefault();
})

gameBox.addEventListener('drop', (evt) => {
    const activeElement = gameBox.querySelector('.selected');
    const currentElement = evt.target;
    const isMoveable = activeElement !== currentElement &&
    currentElement.classList.contains(`cell_empty`);
    if (!isMoveable) {
        return;
    }
    let cell;
    let emptyCell;
    cells.forEach(element => {
        if (String(element.value) === activeElement.textContent) {
            cell = element;
        }
        if (element.top === empty.top && element.left === empty.left) {
            emptyCell = element;
        }
    });
    const xDif = Math.abs(empty.left - cell.left);
    const yDif = Math.abs(empty.top - cell.top);
    
    if (xDif + yDif > 1) {
        return;
    }

    emptyCell.left = cell.left;
    emptyCell.top = cell.top;
    const emptyLeft = empty.left;
    const emptyTop = empty.top;
    empty.left = cell.left;
    empty.top = cell.top;
    cell.left = emptyLeft;
    cell.top = emptyTop;

    activeElement.style.left = `${cell.left * cellSize}px`;
    activeElement.style.top = `${cell.top * cellSize}px`;
    currentElement.style.left = `${empty.left * cellSize}px`;
    currentElement.style.top = `${empty.top * cellSize}px`;

    checkFinish();
    
})
