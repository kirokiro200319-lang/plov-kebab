
const STORAGE_KEY = "plov-kebab-ornament-menu-v2";

const initialMenu = [
    {
        id: 1,
        name: "Плов Кебаб",
        description: "Фирменный восточный плов с мясом и специями.",
        price: 250,
        category: "Плов",
        emoji: "🍛"
    },
    {
        id: 2,
        name: "Плов с говядиной",
        description: "Ароматный рис, сочная говядина и морковь.",
        price: 220,
        category: "Плов",
        emoji: "🍚"
    },
    {
        id: 3,
        name: "Плов с курицей",
        description: "Нежная курица, рис и восточные специи.",
        price: 200,
        category: "Плов",
        emoji: "🍛"
    },
    {
        id: 4,
        name: "Кебаб из баранины",
        description: "Сочный кебаб с ароматными специями.",
        price: 280,
        category: "Кебаб",
        emoji: "🍢"
    },
    {
        id: 5,
        name: "Кебаб из курицы",
        description: "Куриное мясо, приготовленное на гриле.",
        price: 230,
        category: "Кебаб",
        emoji: "🍗"
    },
    {
        id: 6,
        name: "Жумуртка менен омлет",
        description: "Омлет с овощами.",
        price: 180,
        category: "Завтраки",
        emoji: "🍳"
    },
    {
        id: 7,
        name: "Жумуртка менен сосиска",
        description: "Сосиски с яйцом.",
        price: 200,
        category: "Завтраки",
        emoji: "🍳"
    },
    {
        id: 8,
        name: "Ачучук",
        description: "Свежие помидоры, лук и зелень.",
        price: 140,
        category: "Салаты",
        emoji: "🥗"
    },
    {
        id: 9,
        name: "Свежий салат",
        description: "Овощной салат с лёгкой заправкой.",
        price: 150,
        category: "Салаты",
        emoji: "🥗"
    },
    {
        id: 10,
        name: "Чай зелёный",
        description: "Ароматный зелёный чай.",
        price: 50,
        category: "Напитки",
        emoji: "🍵"
    },
    {
        id: 11,
        name: "Чай чёрный",
        description: "Классический чёрный чай.",
        price: 50,
        category: "Напитки",
        emoji: "🫖"
    },
    {
        id: 12,
        name: "Чай с молоком",
        description: "Нежный чай с молоком.",
        price: 60,
        category: "Напитки",
        emoji: "☕"
    },
    {
        id: 13,
        name: "Кофе",
        description: "Горячий ароматный кофе.",
        price: 80,
        category: "Напитки",
        emoji: "☕"
    },
    {
        id: 14,
        name: "Узвар",
        description: "Напиток из сухофруктов.",
        price: 50,
        category: "Напитки",
        emoji: "🥤"
    },
    {
        id: 15,
        name: "Компот",
        description: "Домашний фруктовый компот.",
        price: 50,
        category: "Напитки",
        emoji: "🥤"
    },
    {
        id: 16,
        name: "Чак-чак",
        description: "Восточная сладость с мёдом.",
        price: 140,
        category: "Десерты",
        emoji: "🍯"
    }
];

function loadMenu() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved === null) {
            return initialMenu.map(item => ({ ...item }));
        }

        const parsed = JSON.parse(saved);

        if (!Array.isArray(parsed)) {
            throw new Error("Неверный формат меню");
        }

        return parsed;
    } catch (error) {
        console.error("Не удалось загрузить меню:", error);
        return initialMenu.map(item => ({ ...item }));
    }
}

let dishes = loadMenu();
let activeCategory = "Все";

const menuGrid = document.getElementById("menuGrid");
const categoryButtons = document.getElementById("categoryButtons");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const addForm = document.getElementById("addForm");
const dishCategory = document.getElementById("dishCategory");
const adminList = document.getElementById("adminList");

function saveMenu() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
        return true;
    } catch (error) {
        console.error("Не удалось сохранить меню:", error);
        alert("Не удалось сохранить изменения. Проверьте настройки браузера.");
        return false;
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[character]);
}

function getCategories() {
    return [...new Set([
        "Плов",
        "Кебаб",
        "Завтраки",
        "Салаты",
        "Напитки",
        "Десерты",
        ...dishes.map(dish => dish.category)
    ])].filter(Boolean);
}

function renderCategories() {
    const categories = ["Все", ...getCategories()];

    categoryButtons.innerHTML = categories.map(category => `
        <button
            class="category-btn ${activeCategory === category ? "active" : ""}"
            data-category="${escapeHTML(category)}"
            type="button">
            ${escapeHTML(category)}
        </button>
    `).join("");

    dishCategory.innerHTML = getCategories().map(category => `
        <option value="${escapeHTML(category)}">
            ${escapeHTML(category)}
        </option>
    `).join("");
}

function renderMenu() {
    const query = searchInput.value.trim().toLocaleLowerCase("ru");

    const filtered = dishes.filter(dish => {
        const matchesCategory =
            activeCategory === "Все" ||
            dish.category === activeCategory;

        const searchable =
            `${dish.name} ${dish.description} ${dish.category}`
                .toLocaleLowerCase("ru");

        return matchesCategory && searchable.includes(query);
    });

    resultCount.textContent = `Найдено: ${filtered.length}`;

    if (filtered.length === 0) {
        menuGrid.innerHTML = `
            <div class="empty-state">
                Блюда не найдены. Попробуйте изменить поиск.
            </div>
        `;
        return;
    }

    menuGrid.innerHTML = filtered.map(dish => `
        <article class="dish-card">
            <div class="dish-art">
                <span class="dish-emoji" aria-hidden="true">
                    ${escapeHTML(dish.emoji || "🍽️")}
                </span>
            </div>

            <div class="dish-info">
                <div class="dish-category">
                    ${escapeHTML(dish.category)}
                </div>

                <h3>${escapeHTML(dish.name)}</h3>

                <p>${escapeHTML(dish.description || "")}</p>

                <div class="dish-bottom">
                    <span class="price">
                        ${Number(dish.price).toLocaleString("ru-RU")} сом
                    </span>

                    <button class="order-btn" type="button"
                        data-order="${dish.id}">
                        Выбрать
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

function renderAdminList() {
    if (dishes.length === 0) {
        adminList.innerHTML = `
            <div class="empty-state">Меню пока пустое.</div>
        `;
        return;
    }

    adminList.innerHTML = dishes.map(dish => `
        <div class="admin-row">
            <div class="admin-row-info">
                <strong>${escapeHTML(dish.name)}</strong>
                <small>
                    ${escapeHTML(dish.category)} ·
                    ${Number(dish.price).toLocaleString("ru-RU")} сом
                </small>
            </div>

            <button class="delete-btn" type="button"
                data-delete="${dish.id}">
                Удалить
            </button>
        </div>
    `).join("");
}

function renderAll() {
    renderCategories();
    renderMenu();
    renderAdminList();
}

categoryButtons.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");

    if (!button) return;

    activeCategory = button.dataset.category;
    renderAll();
});

searchInput.addEventListener("input", renderMenu);

addForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("dishName").value.trim();
    const description = document.getElementById("dishDescription").value.trim();
    const price = Number(document.getElementById("dishPrice").value);
    const category = dishCategory.value;

    if (!name || !category || !Number.isFinite(price) || price < 0) {
        alert("Проверьте название, категорию и цену.");
        return;
    }

    const newDish = {
        id: Date.now(),
        name,
        description,
        price,
        category,
        emoji: "🍽️"
    };

    dishes.push(newDish);

    if (!saveMenu()) {
        dishes.pop();
        return;
    }

    addForm.reset();
    activeCategory = "Все";
    renderAll();
});

adminList.addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");

    if (!button) return;

    const id = Number(button.dataset.delete);
    const dish = dishes.find(item => item.id === id);

    if (!dish) return;

    if (!confirm(`Удалить блюдо «${dish.name}»?`)) {
        return;
    }

    const previousDishes = dishes;
    dishes = dishes.filter(item => item.id !== id);

    if (!saveMenu()) {
        dishes = previousDishes;
        return;
    }

    renderAll();
});

menuGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-order]");

    if (!button) return;

    const dish = dishes.find(
        item => item.id === Number(button.dataset.order)
    );

    if (dish) {
        alert(
            `${dish.name}\nЦена: ${dish.price} сом\n\n` +
            "Онлайн-заказ пока не подключён."
        );
    }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderAll();
