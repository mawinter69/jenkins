import behaviorShim from "@/util/behavior-shim";
import Templates from "@/components/dropdowns/templates";
import Utils from "@/components/dropdowns/utils";
import * as Symbols from "@/util/symbols";
import { createElementFromHtml } from "@/util/dom";
import tippy from "tippy.js";

function init() {
  generateButtons();
  generateHandles();
}

function generateHandles() {
  behaviorShim.specify("DIV.dd-handle", "hetero-list", -100, function (e) {
    e.addEventListener("mouseover", function () {
      this.closest(".repeated-chunk").classList.add("hover");
    });
    e.addEventListener("mouseout", function () {
      this.closest(".repeated-chunk").classList.remove("hover");
    });
  });
}

function convertInputsToButtons(e) {
  let oldInputs = e.querySelectorAll("INPUT.hetero-list-add");
  oldInputs.forEach((oldbtn) => {
    let btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.classList.add("hetero-list-add", "jenkins-button");
    btn.innerText = oldbtn.getAttribute("value");
    if (oldbtn.hasAttribute("suffix")) {
      btn.setAttribute("suffix", oldbtn.getAttribute("suffix"));
    }
    let chevron = createElementFromHtml(Symbols.CHEVRON_DOWN);
    btn.appendChild(chevron);
    oldbtn.parentNode.appendChild(btn);
    oldbtn.remove();
  });
}

function udpateTopButton(container) {
  if (container.getAttribute("enableTopButton") === "true") {
    let children = Array.from(container.children).filter(function (n) {
      return (
        n.classList.contains("repeated-chunk") &&
        !n.classList.contains("fade-out")
      );
    });
    const topAddButton = container.querySelector(".hetero-list-add-top");
    if (children.length === 0) {
      topAddButton.classList.add("jenkins-hidden");
    } else {
      topAddButton.classList.remove("jenkins-hidden");
    }
  }
}

function generateButtons() {
  behaviorShim.specify(
    "BUTTON.repeatable-delete",
    "repeatable",
    2,
    function (n) {
      n.addEventListener("click", function () {
        n = n.closest(".repeated-chunk");
        if (n.classList.contains("hetero-list-chunk")) {
          const container = n.closest(".hetero-list-container");
          udpateTopButton(container);
        }
      });
    },
  );

  behaviorShim.specify(
    "DIV.hetero-list-container",
    "hetero-list-new",
    -100,
    function (c) {
      if (isInsideRemovable(c)) {
        return;
      }

      convertInputsToButtons(c);
      let btn = Array.from(c.querySelectorAll("BUTTON.hetero-list-add")).pop();
      let topButton = Array.from(
        c.querySelectorAll("BUTTON.hetero-list-add-top"),
      ).pop();

      let prototypes = c.lastElementChild;
      while (!prototypes.classList.contains("prototypes")) {
        prototypes = prototypes.previousElementSibling;
      }
      let insertionPoint = prototypes.previousElementSibling; // this is where the new item is inserted.

      let templates = [];
      let children = prototypes.children;
      for (let i = 0; i < children.length; i++) {
        let n = children[i];
        let name = n.getAttribute("name");
        let descriptorId = n.getAttribute("descriptorId");
        let title = n.getAttribute("title");

        templates.push({
          html: n.innerHTML,
          name: name,
          descriptorId: descriptorId,
          title: title,
        });
      }
      prototypes.remove();
      let withDragDrop = registerSortableDragDrop(c);

      function insert(instance, template, addOnTop) {
        let nc = document.createElement("div");
        nc.className = "repeated-chunk hetero-list-chunk fade-in";
        nc.setAttribute("name", template.name);
        nc.setAttribute("descriptorId", template.descriptorId);
        nc.innerHTML = template.html;

        instance.hide();

        renderOnDemand(
          nc.querySelector("div.config-page"),
          function () {
            function findInsertionPoint() {
              // given the element to be inserted 'prospect',
              // and the array of existing items 'current',
              // and preferred ordering function, return the position in the array
              // the prospect should be inserted.
              // (for example 0 if it should be the first item)
              function findBestPosition(prospect, current, order) {
                function desirability(pos) {
                  let count = 0;
                  for (let i = 0; i < current.length; i++) {
                    if (i < pos == order(current[i]) <= order(prospect)) {
                      count++;
                    }
                  }
                  return count;
                }

                let bestScore = -1;
                let bestPos = 0;
                for (let i = 0; i <= current.length; i++) {
                  let d = desirability(i);
                  if (bestScore <= d) {
                    // prefer to insert them toward the end
                    bestScore = d;
                    bestPos = i;
                  }
                }
                return bestPos;
              }

              let current = Array.from(c.children).filter(function (e) {
                return e.matches("DIV.repeated-chunk");
              });

              function o(did) {
                if (did instanceof Element) {
                  did = did.getAttribute("descriptorId");
                }
                for (let i = 0; i < templates.length; i++) {
                  if (templates[i].descriptorId == did) {
                    return i;
                  }
                }
                return 0; // can't happen
              }

              let bestPos = findBestPosition(template.descriptorId, current, o);
              if (bestPos < current.length) {
                return current[bestPos];
              } else {
                return insertionPoint;
              }
            }
            let honorOrder = c.classList.contains("honor-order");
            let referenceNode = honorOrder
              ? findInsertionPoint()
              : insertionPoint;

            if (
              addOnTop &&
              !honorOrder &&
              c.getAttribute("enableTopButton") === "true"
            ) {
              let children = Array.from(c.children).filter(function (n) {
                return n.classList.contains("repeated-chunk");
              });
              c.insertBefore(nc, children[0]);
            } else {
              referenceNode.parentNode.insertBefore(nc, referenceNode);
            }

            // Initialize drag & drop for this component
            if (withDragDrop) {
              registerSortableDragDrop(nc);
            }
            Behaviour.applySubtree(nc, true);
            ensureVisible(nc);
            nc.classList.remove("fade-in");
            udpateTopButton(c);
            layoutUpdateCallback.call();
          },
          true,
        );
      }

      function has(id) {
        return (
          c.querySelector('DIV.repeated-chunk[descriptorId="' + id + '"]') !=
          null
        );
      }

      let oneEach = c.classList.contains("one-each");

      function expand(instance, addOnTop) {
        let menuItems = [];
        for (let i = 0; i < templates.length; i++) {
          let n = templates[i];
          let disabled = oneEach && has(n.descriptorId);
          let type = disabled ? "DISABLED" : "button";
          let item = {
            label: n.title,
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              insert(instance, n, addOnTop);
            },
            type: type,
          };
          menuItems.push(item);
        }
        const menuContainer = document.createElement("div");
        const menu = Utils.generateDropdownItems(menuItems, true);
        menuContainer.appendChild(createFilter(menu));
        menuContainer.appendChild(menu);
        instance.setContent(menuContainer);
      }

      generateDropDown(btn, (instance) => {
        expand(instance, false);
      });
      generateDropDown(topButton, (instance) => {
        expand(instance, true);
      });
    },
  );
}

function createFilter(menu) {
  const filterInput = createElementFromHtml(`
    <input class="jenkins-dropdown__filter-input" placeholder="Filter" spellcheck="false" type="search"/>
  `);

  filterInput.addEventListener("input", (event) =>
    applyFilterKeyword(menu, event.currentTarget),
  );
  filterInput.addEventListener("click", (event) => event.stopPropagation());
  filterInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  const filterContainer = createElementFromHtml(`
    <div class="jenkins-dropdown__filter">
      <div class="jenkins-dropdown__item__icon">
        ${Symbols.FUNNEL}
      </div>
    </div>
  `);
  filterContainer.appendChild(filterInput);
  return filterContainer;
}

function applyFilterKeyword(menu, filterInput) {
  const filterKeyword = (filterInput.value || "").toLowerCase();
  let items = menu.querySelectorAll(
    ".jenkins-dropdown__item, .jenkins-dropdown__disabled",
  );
  for (let item of items) {
    let match = item.innerText.toLowerCase().includes(filterKeyword);
    item.style.display = match ? "inline-flex" : "none";
  }
}

function generateDropDown(button, callback) {
  tippy(
    button,
    Object.assign({}, Templates.dropdown(), {
      appendTo: undefined,
      onCreate(instance) {
        if (instance.loaded) {
          return;
        }
        instance.popper.addEventListener("click", () => {
          instance.hide();
        });
        instance.popper.addEventListener("keydown", () => {
          if (event.key === "Escape") {
            instance.hide();
          }
        });
      },
      onShow(instance) {
        callback(instance);
        button.dataset.expanded = "true";
      },
      onHide() {
        button.dataset.expanded = "false";
      },
    }),
  );
}

export default { init };
