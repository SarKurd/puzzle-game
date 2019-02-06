function main() {
  let grid = {};
  let isDragged = false;
  let currentDraggable = null;
  let draggablesList = [];
  let level = 2;
  let pieceSize = 100;
  const wrapper = document.querySelector(".wrapper");
  const puzzleContainer = document.querySelector(".puzzle");
  let puzzleContainerX = puzzleContainer.getBoundingClientRect().x;
  let puzzleContainerY = puzzleContainer.getBoundingClientRect().y;
  let puzzleContainerWidth = 200;
  let puzzleContainerHeight = 200;
  let currentDraggableX = null;
  let currentDraggableY = null;
  let currentDraggableOriginal = { x: 0, y: 0 };
  let mouseLocationWithinDraggable = { x: 0, y: 0 };

  function reset() {
    grid = {};
    isDragged = false;
    draggablesList = [];
  }
  function game(level) {
    puzzleContainer.style.minWidth = `${pieceSize * level}px`;
    puzzleContainer.style.minHeight = `${pieceSize * level}px`;

    for (let i = 0; i < level; ++i) {
      for (let k = 0; k < level; ++k) {
        grid[i + "" + k] = { value: false, taken: false };

        const draggable = document.createElement("div");
        draggable.style.width = `${pieceSize}`;
        draggable.style.height = `${pieceSize}`;
        draggable.style.background = "url(assets/background.jpg)";
        draggable.style.backgroundSize = `${pieceSize * level}px ${pieceSize *
          level}px`;

        draggable.style.backgroundPosition = `${i * -pieceSize}% ${k *
          -pieceSize}%`;

        draggable.setAttribute("class", "draggable");
        draggable.setAttribute("data-id", i + "" + k);

        //Random y
        const draggableTopPosition = Math.round(Math.random());
        if (!!draggableTopPosition) {
          const RandomTop = Math.floor(
            Math.floor(Math.random() * (100 - 20 + 1) + 20)
          );
          draggable.style.top = `${RandomTop}px`;
        } else {
          const RandomTop = Math.floor(
            Math.floor(
              Math.random() * (window.innerHeight - 120 - 500 + 1) + 500
            )
          );
          draggable.style.top = `${RandomTop}px`;
        }
        //Random X
        const draggableLeftPosition = Math.round(Math.random());
        if (!!draggableLeftPosition) {
          const RandomLeft = Math.floor(
            Math.floor(Math.random() * (580 - 20 + 1) + 20)
          );
          draggable.style.left = `${RandomLeft}px`;
        } else {
          const RandomLeft = Math.floor(
            Math.floor(
              Math.random() * (window.innerWidth - 120 - 740 + 1) + 740
            )
          );

          draggable.style.left = `${RandomLeft}px`;
        }

        draggablesList.push(draggable);
      }

      puzzleContainerX = puzzleContainer.getBoundingClientRect().x;
      puzzleContainerY = puzzleContainer.getBoundingClientRect().y;
      puzzleContainerWidth = puzzleContainer.getBoundingClientRect().width;
      puzzleContainerHeight = puzzleContainer.getBoundingClientRect().height;
    }

    for (let i of draggablesList) {
      wrapper.appendChild(i);
    }

    for (let draggable of draggablesList) {
      draggable.addEventListener("mousedown", function(event) {
        isDragged = true;
        currentDraggable = this;
        this.style.zIndex = "100";
        currentDraggableOriginal.y =
          this.getBoundingClientRect().y + pieceSize / 2;
        currentDraggableOriginal.x =
          this.getBoundingClientRect().x + pieceSize / 2;

        //mouse location corresponding to the current draggable
        mouseLocationWithinDraggable.x =
          event.clientX - this.getBoundingClientRect().x;
        mouseLocationWithinDraggable.y =
          event.clientY - this.getBoundingClientRect().y;

        if (
          currentDraggableOriginal.x > puzzleContainerX &&
          currentDraggableOriginal.x <
            puzzleContainerX + puzzleContainerWidth &&
          currentDraggableOriginal.y > puzzleContainerY &&
          currentDraggableOriginal.y < puzzleContainerY + puzzleContainerHeight
        ) {
          const normalizeX = Math.round(
            ((currentDraggableOriginal.x - puzzleContainerX) /
              puzzleContainerWidth) *
              (level - 1 - 0)
          );

          const normalizeY = Math.round(
            ((currentDraggableOriginal.y - puzzleContainerY) /
              puzzleContainerHeight) *
              (level - 1)
          );
          if (
            normalizeX >= 0 &&
            normalizeX <= level - 1 &&
            normalizeY >= 0 &&
            normalizeY <= level - 1
          ) {
            grid[normalizeX + "" + normalizeY].taken = false;
            grid[normalizeX + "" + normalizeY].value = false;
          }
        }
      });
    }
  }

  document.addEventListener("mousemove", function(event) {
    if (isDragged) {
      currentDraggable.style.top = `${event.y -
        mouseLocationWithinDraggable.y}px`;
      currentDraggable.style.left = `${event.x -
        mouseLocationWithinDraggable.x}px`;

      currentDraggableX =
        currentDraggable.getBoundingClientRect().x + pieceSize / 2;
      currentDraggableY =
        currentDraggable.getBoundingClientRect().y + pieceSize / 2;
    }
  });

  window.addEventListener("mouseup", function(event) {
    if (isDragged) {
      currentDraggableX =
        currentDraggable.getBoundingClientRect().x + pieceSize / 2;
      currentDraggableY =
        currentDraggable.getBoundingClientRect().y + pieceSize / 2;

      const normalizeX = Math.round(
        ((currentDraggableX - puzzleContainerX) /
          (puzzleContainerX + puzzleContainerWidth - puzzleContainerX)) *
          (level - 1 - 0) +
          0
      );

      const normalizeY = Math.round(
        ((currentDraggableY - puzzleContainerY) /
          (puzzleContainerY + puzzleContainerHeight - puzzleContainerY)) *
          (level - 1 - 0) +
          0
      );

      const dragId = currentDraggable.getAttribute("data-id");

      if (
        currentDraggableX > puzzleContainerX &&
        currentDraggableX < puzzleContainerX + puzzleContainerWidth &&
        currentDraggableY > puzzleContainerY &&
        currentDraggableY < puzzleContainerY + puzzleContainerHeight
      ) {
        if (
          grid[normalizeX + "" + normalizeY].value === true ||
          grid[normalizeX + "" + normalizeY].taken === true
        ) {
          currentDraggable.style.top = `${currentDraggableOriginal.y}px`;
          currentDraggable.style.left = `${currentDraggableOriginal.x}px`;
          currentDraggableOriginal = { x: 0, y: 0 };
        } else {
          if (dragId === normalizeX + "" + normalizeY) {
            grid[normalizeX + "" + normalizeY].value = true;
          }
          grid[normalizeX + "" + normalizeY].taken = true;

          currentDraggable.style.top = `${puzzleContainerY +
            (puzzleContainerHeight / level) * normalizeY}px`;
          currentDraggable.style.left = `${puzzleContainerX +
            (puzzleContainerWidth / level) * normalizeX}px`;
        }

        isDragged = false;
        const isWon = Object.values(grid).every(item => item.value === true);
        if (isWon) {
          document.querySelector(".won").style.display = "flex";
        }
      } else {
        currentDraggable.style.top = `${event.clientY -
          mouseLocationWithinDraggable.y}px`;
        currentDraggable.style.left = `${event.clientX -
          mouseLocationWithinDraggable.x}px`;
        grid[dragId].value = false;
        isDragged = false;
      }
      currentDraggable.style.zIndex = "1";
      currentDraggable = {};
    }
    isDragged = false;
  });

  document
    .querySelector("#button--reset")
    .addEventListener("click", function() {
      this.parentNode.style.display = "none";

      const draggablesToBeRemoved = document.querySelectorAll(".draggable");
      for (let i = 0; i < draggablesToBeRemoved.length; ++i) {
        draggablesToBeRemoved[i].remove();
      }
      reset();
      ++level;
      if (level > 4) {
        level = 4;
      }
      game(level);
    });
  game(level);
}

window.onload = main;
