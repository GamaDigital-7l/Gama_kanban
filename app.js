// GAMA - Kanban Project Management Application

class GamaApp {
    constructor() {
        this.currentProject = null;
        this.currentCard = null;
        this.currentColumn = null;
        this.draggedCard = null;
        this.editMode = false;
        
        // Initialize data
        this.initializeData();
        this.initializeEventListeners();
        this.initializeTheme();
        this.renderProjects();
        this.renderLabels();
    }

    // Data initialization
    initializeData() {
        const storedData = localStorage.getItem('gamaData');
        if (storedData) {
            this.data = JSON.parse(storedData);
        } else {
            // Initial data
            this.data = {
                projects: [
                    {
                        id: "proj-1",
                        name: "Desenvolvimento Web",
                        description: "Projeto de desenvolvimento do novo site corporativo",
                        color: "#4f46e5",
                        columns: [
                            {
                                id: "col-1",
                                name: "A Fazer",
                                cards: [
                                    {
                                        id: "card-1",
                                        title: "Criar wireframes",
                                        description: "Desenhar os wireframes das principais páginas",
                                        labels: ["Design", "Urgente"],
                                        dueDate: "2024-09-15",
                                        members: ["João Silva"],
                                        comments: [
                                            {author: "Maria", text: "Precisamos focar na UX", date: "2024-09-01"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "col-2", 
                                name: "Em Progresso",
                                cards: [
                                    {
                                        id: "card-2",
                                        title: "Desenvolver API REST",
                                        description: "Implementar endpoints para autenticação e CRUD",
                                        labels: ["Backend", "Feature"],
                                        dueDate: "2024-09-20",
                                        members: ["Carlos Santos"],
                                        comments: []
                                    }
                                ]
                            },
                            {
                                id: "col-3",
                                name: "Concluído", 
                                cards: [
                                    {
                                        id: "card-3",
                                        title: "Setup do ambiente",
                                        description: "Configurar Docker e dependências",
                                        labels: ["DevOps"],
                                        dueDate: "2024-08-30",
                                        members: ["Ana Costa"],
                                        comments: [
                                            {author: "Ana", text: "Ambiente configurado com sucesso!", date: "2024-08-30"}
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: "proj-2", 
                        name: "Marketing Digital",
                        description: "Campanha de marketing para Q4",
                        color: "#10b981",
                        columns: [
                            {
                                id: "col-4",
                                name: "Ideias",
                                cards: [
                                    {
                                        id: "card-4",
                                        title: "Campanha redes sociais",
                                        description: "Planejar posts para Instagram e LinkedIn",
                                        labels: ["Social Media", "Planejamento"],
                                        dueDate: "2024-09-10",
                                        members: ["Paula Marketing"],
                                        comments: []
                                    }
                                ]
                            },
                            {
                                id: "col-5",
                                name: "Em Produção", 
                                cards: []
                            },
                            {
                                id: "col-6",
                                name: "Publicado",
                                cards: []
                            }
                        ]
                    },
                    {
                        id: "proj-3",
                        name: "Recursos Humanos", 
                        description: "Gestão de pessoas e processos internos",
                        color: "#f59e0b",
                        columns: [
                            {
                                id: "col-7",
                                name: "Pendente",
                                cards: [
                                    {
                                        id: "card-5",
                                        title: "Processo seletivo dev",
                                        description: "Contratar 2 desenvolvedores júnior",
                                        labels: ["Recrutamento", "Urgente"],
                                        dueDate: "2024-09-25",
                                        members: ["RH Team"],
                                        comments: [
                                            {author: "RH", text: "Já temos 15 candidatos", date: "2024-09-02"}
                                        ]
                                    }
                                ]
                            },
                            {
                                id: "col-8",
                                name: "Em Andamento",
                                cards: []
                            },
                            {
                                id: "col-9", 
                                name: "Finalizado",
                                cards: []
                            }
                        ]
                    }
                ],
                labels: [
                    {name: "Urgente", color: "#ef4444"},
                    {name: "Bug", color: "#f97316"}, 
                    {name: "Feature", color: "#3b82f6"},
                    {name: "Revisão", color: "#8b5cf6"},
                    {name: "Design", color: "#ec4899"},
                    {name: "Backend", color: "#10b981"},
                    {name: "DevOps", color: "#6b7280"},
                    {name: "Social Media", color: "#14b8a6"},
                    {name: "Planejamento", color: "#f59e0b"},
                    {name: "Recrutamento", color: "#84cc16"}
                ]
            };
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('gamaData', JSON.stringify(this.data));
    }

    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    }

    // Theme management
    initializeTheme() {
        const savedTheme = localStorage.getItem('gamaTheme') || 'light';
        document.documentElement.setAttribute('data-color-scheme', savedTheme);
        this.updateThemeButton(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-color-scheme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-color-scheme', newTheme);
        localStorage.setItem('gamaTheme', newTheme);
        this.updateThemeButton(newTheme);
    }

    updateThemeButton(theme) {
        const button = document.getElementById('themeToggle');
        button.textContent = theme === 'dark' ? '☀️ Tema' : '🌙 Tema';
    }

    // Event listeners
    initializeEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => this.toggleTheme());

        // Project management
        document.getElementById('newProjectBtn').addEventListener('click', () => this.openProjectModal());
        document.getElementById('editProjectBtn').addEventListener('click', () => this.editCurrentProject());
        
        // Column management
        document.getElementById('newColumnBtn').addEventListener('click', () => this.openColumnModal());

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => this.searchCards(e.target.value));

        // Filters
        document.getElementById('labelFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('memberFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('dueDateFilter').addEventListener('change', () => this.applyFilters());
        document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

        // Modal event listeners
        this.setupModalEventListeners();
    }

    setupModalEventListeners() {
        // Project modal
        const projectModal = document.getElementById('projectModal');
        document.getElementById('projectModalClose').addEventListener('click', () => this.closeModal('projectModal'));
        document.getElementById('projectModalOverlay').addEventListener('click', () => this.closeModal('projectModal'));
        document.getElementById('cancelProjectBtn').addEventListener('click', () => this.closeModal('projectModal'));
        document.getElementById('saveProjectBtn').addEventListener('click', () => this.saveProject());
        document.getElementById('deleteProjectBtn').addEventListener('click', () => this.deleteProject());

        // Card modal
        const cardModal = document.getElementById('cardModal');
        document.getElementById('cardModalClose').addEventListener('click', () => this.closeModal('cardModal'));
        document.getElementById('cardModalOverlay').addEventListener('click', () => this.closeModal('cardModal'));
        document.getElementById('cancelCardBtn').addEventListener('click', () => this.closeModal('cardModal'));
        document.getElementById('saveCardBtn').addEventListener('click', () => this.saveCard());
        document.getElementById('deleteCardBtn').addEventListener('click', () => this.deleteCard());
        document.getElementById('addCommentBtn').addEventListener('click', () => this.addComment());

        // Column modal
        const columnModal = document.getElementById('columnModal');
        document.getElementById('columnModalClose').addEventListener('click', () => this.closeModal('columnModal'));
        document.getElementById('columnModalOverlay').addEventListener('click', () => this.closeModal('columnModal'));
        document.getElementById('cancelColumnBtn').addEventListener('click', () => this.closeModal('columnModal'));
        document.getElementById('saveColumnBtn').addEventListener('click', () => this.saveColumn());
        document.getElementById('deleteColumnBtn').addEventListener('click', () => this.deleteColumn());
    }

    // Project management
    renderProjects() {
        const container = document.getElementById('projectsList');
        container.innerHTML = '';

        this.data.projects.forEach(project => {
            const projectEl = document.createElement('div');
            projectEl.className = 'project-item';
            projectEl.dataset.projectId = project.id;
            
            if (this.currentProject && this.currentProject.id === project.id) {
                projectEl.classList.add('active');
            }

            projectEl.innerHTML = `
                <div class="project-item__color" style="background-color: ${project.color}"></div>
                <div class="project-item__info">
                    <div class="project-item__name">${project.name}</div>
                    <div class="project-item__description">${project.description}</div>
                </div>
            `;

            projectEl.addEventListener('click', () => this.selectProject(project.id));
            container.appendChild(projectEl);
        });
    }

    selectProject(projectId) {
        this.currentProject = this.data.projects.find(p => p.id === projectId);
        this.renderProjects();
        this.renderKanbanBoard();
        this.updateProjectHeader();
        this.updateFilters();
    }

    updateProjectHeader() {
        const header = document.getElementById('projectHeader');
        const title = document.getElementById('projectTitle');
        const description = document.getElementById('projectDescription');
        const filtersContainer = document.getElementById('filtersContainer');

        if (this.currentProject) {
            header.style.display = 'flex';
            filtersContainer.style.display = 'flex';
            title.textContent = this.currentProject.name;
            description.textContent = this.currentProject.description;
        } else {
            header.style.display = 'none';
            filtersContainer.style.display = 'none';
        }
    }

    openProjectModal(project = null) {
        this.editMode = !!project;
        this.currentEditProject = project;

        const modal = document.getElementById('projectModal');
        const title = document.getElementById('projectModalTitle');
        const nameInput = document.getElementById('projectNameInput');
        const descInput = document.getElementById('projectDescInput');
        const colorInput = document.getElementById('projectColorInput');
        const deleteBtn = document.getElementById('deleteProjectBtn');

        title.textContent = project ? 'Editar Projeto' : 'Novo Projeto';
        nameInput.value = project ? project.name : '';
        descInput.value = project ? project.description : '';
        colorInput.value = project ? project.color : '#4f46e5';
        deleteBtn.style.display = project ? 'block' : 'none';

        this.showModal('projectModal');
    }

    saveProject() {
        const nameInput = document.getElementById('projectNameInput');
        const descInput = document.getElementById('projectDescInput');
        const colorInput = document.getElementById('projectColorInput');

        const name = nameInput.value.trim();
        const description = descInput.value.trim();
        const color = colorInput.value;

        if (!name) {
            alert('Nome do projeto é obrigatório');
            return;
        }

        if (this.editMode && this.currentEditProject) {
            // Edit existing project
            this.currentEditProject.name = name;
            this.currentEditProject.description = description;
            this.currentEditProject.color = color;
        } else {
            // Create new project
            const newProject = {
                id: this.generateId(),
                name,
                description,
                color,
                columns: [
                    { id: this.generateId(), name: 'A Fazer', cards: [] },
                    { id: this.generateId(), name: 'Em Progresso', cards: [] },
                    { id: this.generateId(), name: 'Concluído', cards: [] }
                ]
            };
            this.data.projects.push(newProject);
        }

        this.saveData();
        this.renderProjects();
        this.updateProjectHeader();
        this.closeModal('projectModal');

        if (this.editMode && this.currentProject && this.currentProject.id === this.currentEditProject.id) {
            this.renderKanbanBoard();
        }
    }

    editCurrentProject() {
        if (this.currentProject) {
            this.openProjectModal(this.currentProject);
        }
    }

    deleteProject() {
        if (this.currentEditProject && confirm('Tem certeza que deseja excluir este projeto?')) {
            const index = this.data.projects.findIndex(p => p.id === this.currentEditProject.id);
            if (index > -1) {
                this.data.projects.splice(index, 1);
                this.saveData();
                this.renderProjects();
                
                if (this.currentProject && this.currentProject.id === this.currentEditProject.id) {
                    this.currentProject = null;
                    this.updateProjectHeader();
                    this.renderKanbanBoard();
                }
                
                this.closeModal('projectModal');
            }
        }
    }

    // Clear all drag states
    clearAllDragStates() {
        // Remove drag-over class from all columns
        const columns = document.querySelectorAll('.column__content');
        columns.forEach(column => {
            column.classList.remove('drag-over');
        });
        
        // Remove dragging class from all cards
        const cards = document.querySelectorAll('.card-item');
        cards.forEach(card => {
            card.classList.remove('dragging');
        });
        
        // Reset drag data
        this.draggedCard = null;
    }

    // Kanban board rendering
    renderKanbanBoard() {
        const board = document.getElementById('kanbanBoard');
        const welcomeMessage = document.getElementById('welcomeMessage');

        if (!this.currentProject) {
            welcomeMessage.style.display = 'block';
            board.innerHTML = '';
            board.appendChild(welcomeMessage);
            return;
        }

        welcomeMessage.style.display = 'none';
        board.innerHTML = '';

        this.currentProject.columns.forEach(column => {
            const columnEl = this.createColumnElement(column);
            board.appendChild(columnEl);
        });
    }

    createColumnElement(column) {
        const columnEl = document.createElement('div');
        columnEl.className = 'column';
        columnEl.dataset.columnId = column.id;

        columnEl.innerHTML = `
            <div class="column__header">
                <div>
                    <h3 class="column__title">${column.name}</h3>
                </div>
                <div class="column__actions">
                    <span class="column__count">${column.cards.length}</span>
                    <button class="edit-column-btn" title="Editar coluna">✏️</button>
                </div>
            </div>
            <div class="column__content" data-column-id="${column.id}">
                ${column.cards.map(card => this.createCardHTML(card)).join('')}
            </div>
            <div class="column__add-card">
                <button class="add-card-btn" data-column-id="${column.id}">+ Adicionar card</button>
            </div>
        `;

        // Add event listeners
        const editColumnBtn = columnEl.querySelector('.edit-column-btn');
        const addCardBtn = columnEl.querySelector('.add-card-btn');
        
        editColumnBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openColumnModal(column);
        });
        
        addCardBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.openCardModal(null, column.id);
        });

        // Setup drag and drop for column content
        const content = columnEl.querySelector('.column__content');
        this.setupColumnDropZone(content);
        
        // Setup card events after DOM is ready
        setTimeout(() => {
            this.setupCardEvents(content);
        }, 0);

        return columnEl;
    }

    setupCardEvents(columnContent) {
        const cards = columnContent.querySelectorAll('.card-item');
        
        cards.forEach(cardEl => {
            // Add click handler
            cardEl.addEventListener('click', (e) => {
                e.stopPropagation();
                const cardId = cardEl.dataset.cardId;
                const columnId = columnContent.dataset.columnId;
                this.openCardModal(cardId, columnId);
            });
            
            // Add drag handlers
            cardEl.addEventListener('dragstart', (e) => {
                const cardId = cardEl.dataset.cardId;
                const sourceColumnId = columnContent.dataset.columnId;
                this.draggedCard = { id: cardId, sourceColumnId };
                cardEl.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', cardId);
            });
            
            cardEl.addEventListener('dragend', (e) => {
                // Clean up drag state
                cardEl.classList.remove('dragging');
                this.clearAllDragStates();
            });
        });
    }

    createCardHTML(card) {
        const dueDateClass = this.getDueDateClass(card.dueDate);
        const labelsHTML = card.labels.map(labelName => {
            const label = this.data.labels.find(l => l.name === labelName);
            return label ? `<span class="card-label" style="background-color: ${label.color}">${labelName}</span>` : '';
        }).join('');

        return `
            <div class="card-item" data-card-id="${card.id}" draggable="true">
                <div class="card-item__title">${card.title}</div>
                ${card.description ? `<div class="card-item__description">${card.description}</div>` : ''}
                ${card.labels.length > 0 ? `<div class="card-item__labels">${labelsHTML}</div>` : ''}
                <div class="card-item__meta">
                    <div class="card-item__due-date ${dueDateClass}">
                        ${card.dueDate ? `📅 ${this.formatDate(card.dueDate)}` : ''}
                    </div>
                    <div class="card-item__member">${card.members[0] || ''}</div>
                </div>
                ${card.comments.length > 0 ? `<div class="card-item__comments">💬 ${card.comments.length}</div>` : ''}
            </div>
        `;
    }

    getDueDateClass(dueDate) {
        if (!dueDate) return '';
        
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'overdue';
        if (diffDays <= 3) return 'due-soon';
        return '';
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    }

    setupColumnDropZone(columnContent) {
        columnContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            // Clear other drag states first
            document.querySelectorAll('.column__content').forEach(col => {
                if (col !== columnContent) {
                    col.classList.remove('drag-over');
                }
            });
            
            columnContent.classList.add('drag-over');
        });

        columnContent.addEventListener('dragleave', (e) => {
            // Only remove drag-over if we're actually leaving the column content
            const rect = columnContent.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                columnContent.classList.remove('drag-over');
            }
        });

        columnContent.addEventListener('drop', (e) => {
            e.preventDefault();
            columnContent.classList.remove('drag-over');
            
            if (this.draggedCard) {
                const targetColumnId = columnContent.dataset.columnId;
                this.moveCard(this.draggedCard.id, this.draggedCard.sourceColumnId, targetColumnId);
            }
            
            // Clean up all drag states
            this.clearAllDragStates();
        });
    }

    moveCard(cardId, sourceColumnId, targetColumnId) {
        if (sourceColumnId === targetColumnId) return;

        const sourceColumn = this.currentProject.columns.find(c => c.id === sourceColumnId);
        const targetColumn = this.currentProject.columns.find(c => c.id === targetColumnId);
        
        const cardIndex = sourceColumn.cards.findIndex(c => c.id === cardId);
        if (cardIndex > -1) {
            const card = sourceColumn.cards.splice(cardIndex, 1)[0];
            targetColumn.cards.push(card);
            
            this.saveData();
            this.renderKanbanBoard();
            this.applyFilters(); // Reapply filters after move
        }
    }

    // Column management
    openColumnModal(column = null) {
        this.editMode = !!column;
        this.currentEditColumn = column;

        const modal = document.getElementById('columnModal');
        const title = document.getElementById('columnModalTitle');
        const nameInput = document.getElementById('columnNameInput');
        const deleteBtn = document.getElementById('deleteColumnBtn');

        title.textContent = column ? 'Editar Coluna' : 'Nova Coluna';
        nameInput.value = column ? column.name : '';
        deleteBtn.style.display = column ? 'block' : 'none';

        this.showModal('columnModal');
    }

    saveColumn() {
        const nameInput = document.getElementById('columnNameInput');
        const name = nameInput.value.trim();

        if (!name) {
            alert('Nome da coluna é obrigatório');
            return;
        }

        if (this.editMode && this.currentEditColumn) {
            this.currentEditColumn.name = name;
        } else {
            const newColumn = {
                id: this.generateId(),
                name,
                cards: []
            };
            this.currentProject.columns.push(newColumn);
        }

        this.saveData();
        this.renderKanbanBoard();
        this.closeModal('columnModal');
    }

    deleteColumn() {
        if (this.currentEditColumn && confirm('Tem certeza que deseja excluir esta coluna? Todos os cards serão perdidos.')) {
            const index = this.currentProject.columns.findIndex(c => c.id === this.currentEditColumn.id);
            if (index > -1) {
                this.currentProject.columns.splice(index, 1);
                this.saveData();
                this.renderKanbanBoard();
                this.closeModal('columnModal');
            }
        }
    }

    // Card management
    openCardModal(cardId = null, columnId = null) {
        this.editMode = !!cardId;
        this.currentEditCard = null;
        this.currentEditColumnId = columnId;

        if (cardId) {
            // Find the card and its column
            for (const column of this.currentProject.columns) {
                const card = column.cards.find(c => c.id === cardId);
                if (card) {
                    this.currentEditCard = card;
                    this.currentEditColumnId = column.id;
                    break;
                }
            }
        }

        const modal = document.getElementById('cardModal');
        const title = document.getElementById('cardModalTitle');
        const titleInput = document.getElementById('cardTitleInput');
        const descInput = document.getElementById('cardDescInput');
        const dueDateInput = document.getElementById('cardDueDateInput');
        const memberInput = document.getElementById('cardMemberInput');
        const deleteBtn = document.getElementById('deleteCardBtn');

        title.textContent = this.currentEditCard ? 'Editar Card' : 'Novo Card';
        titleInput.value = this.currentEditCard ? this.currentEditCard.title : '';
        descInput.value = this.currentEditCard ? this.currentEditCard.description : '';
        dueDateInput.value = this.currentEditCard ? this.currentEditCard.dueDate : '';
        memberInput.value = this.currentEditCard && this.currentEditCard.members[0] ? this.currentEditCard.members[0] : '';
        deleteBtn.style.display = this.currentEditCard ? 'block' : 'none';

        this.renderCardLabels();
        this.renderCardComments();
        this.showModal('cardModal');
    }

    renderCardLabels() {
        const container = document.getElementById('cardLabels');
        container.innerHTML = '';

        this.data.labels.forEach(label => {
            const isSelected = this.currentEditCard ? this.currentEditCard.labels.includes(label.name) : false;
            
            const labelEl = document.createElement('div');
            labelEl.className = `label-option ${isSelected ? 'selected' : ''}`;
            labelEl.dataset.labelName = label.name;
            
            labelEl.innerHTML = `
                <div class="label-color" style="background-color: ${label.color}"></div>
                <span>${label.name}</span>
            `;

            labelEl.addEventListener('click', () => {
                labelEl.classList.toggle('selected');
            });

            container.appendChild(labelEl);
        });
    }

    renderCardComments() {
        const container = document.getElementById('commentsList');
        container.innerHTML = '';

        if (this.currentEditCard && this.currentEditCard.comments) {
            this.currentEditCard.comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.innerHTML = `
                    <div class="comment-item__header">
                        <div class="comment-item__author">${comment.author}</div>
                        <div class="comment-item__date">${this.formatDate(comment.date)}</div>
                    </div>
                    <div class="comment-item__text">${comment.text}</div>
                `;
                container.appendChild(commentEl);
            });
        }
    }

    addComment() {
        const input = document.getElementById('newCommentInput');
        const text = input.value.trim();

        if (!text || !this.currentEditCard) return;

        const comment = {
            author: 'Usuário',
            text,
            date: new Date().toISOString().split('T')[0]
        };

        this.currentEditCard.comments.push(comment);
        input.value = '';
        this.renderCardComments();
        this.saveData();
    }

    saveCard() {
        const titleInput = document.getElementById('cardTitleInput');
        const descInput = document.getElementById('cardDescInput');
        const dueDateInput = document.getElementById('cardDueDateInput');
        const memberInput = document.getElementById('cardMemberInput');

        const title = titleInput.value.trim();
        const description = descInput.value.trim();
        const dueDate = dueDateInput.value;
        const member = memberInput.value.trim();

        if (!title) {
            alert('Título do card é obrigatório');
            return;
        }

        // Get selected labels
        const selectedLabels = Array.from(document.querySelectorAll('.label-option.selected'))
            .map(el => el.dataset.labelName);

        if (this.currentEditCard) {
            // Edit existing card
            this.currentEditCard.title = title;
            this.currentEditCard.description = description;
            this.currentEditCard.dueDate = dueDate;
            this.currentEditCard.members = member ? [member] : [];
            this.currentEditCard.labels = selectedLabels;
        } else {
            // Create new card
            const newCard = {
                id: this.generateId(),
                title,
                description,
                dueDate,
                members: member ? [member] : [],
                labels: selectedLabels,
                comments: []
            };

            const column = this.currentProject.columns.find(c => c.id === this.currentEditColumnId);
            if (column) {
                column.cards.push(newCard);
            }
        }

        this.saveData();
        this.renderKanbanBoard();
        this.closeModal('cardModal');
        this.applyFilters(); // Reapply filters after save
    }

    deleteCard() {
        if (this.currentEditCard && confirm('Tem certeza que deseja excluir este card?')) {
            const column = this.currentProject.columns.find(c => c.id === this.currentEditColumnId);
            if (column) {
                const index = column.cards.findIndex(c => c.id === this.currentEditCard.id);
                if (index > -1) {
                    column.cards.splice(index, 1);
                    this.saveData();
                    this.renderKanbanBoard();
                    this.closeModal('cardModal');
                }
            }
        }
    }

    // Search and filters
    searchCards(query) {
        if (!this.currentProject) return;

        const cards = document.querySelectorAll('.card-item');
        cards.forEach(cardEl => {
            const cardId = cardEl.dataset.cardId;
            const card = this.findCardById(cardId);
            
            if (card) {
                const searchableText = (card.title + ' ' + card.description + ' ' + card.labels.join(' ')).toLowerCase();
                const matches = searchableText.includes(query.toLowerCase());
                cardEl.style.display = matches ? 'block' : 'none';
            }
        });
    }

    updateFilters() {
        if (!this.currentProject) return;

        // Update label filter
        const labelFilter = document.getElementById('labelFilter');
        labelFilter.innerHTML = '<option value="">Todas as Labels</option>';
        
        const allLabels = new Set();
        this.currentProject.columns.forEach(column => {
            column.cards.forEach(card => {
                card.labels.forEach(label => allLabels.add(label));
            });
        });

        allLabels.forEach(label => {
            const option = document.createElement('option');
            option.value = label;
            option.textContent = label;
            labelFilter.appendChild(option);
        });

        // Update member filter
        const memberFilter = document.getElementById('memberFilter');
        memberFilter.innerHTML = '<option value="">Todos os Membros</option>';
        
        const allMembers = new Set();
        this.currentProject.columns.forEach(column => {
            column.cards.forEach(card => {
                card.members.forEach(member => allMembers.add(member));
            });
        });

        allMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member;
            option.textContent = member;
            memberFilter.appendChild(option);
        });
    }

    applyFilters() {
        if (!this.currentProject) return;

        const labelFilter = document.getElementById('labelFilter').value;
        const memberFilter = document.getElementById('memberFilter').value;
        const dueDateFilter = document.getElementById('dueDateFilter').value;

        const cards = document.querySelectorAll('.card-item');
        cards.forEach(cardEl => {
            const cardId = cardEl.dataset.cardId;
            const card = this.findCardById(cardId);
            
            if (card) {
                let show = true;

                if (labelFilter && !card.labels.includes(labelFilter)) {
                    show = false;
                }

                if (memberFilter && !card.members.includes(memberFilter)) {
                    show = false;
                }

                if (dueDateFilter && card.dueDate !== dueDateFilter) {
                    show = false;
                }

                cardEl.style.display = show ? 'block' : 'none';
            }
        });
    }

    clearFilters() {
        document.getElementById('labelFilter').value = '';
        document.getElementById('memberFilter').value = '';
        document.getElementById('dueDateFilter').value = '';
        document.getElementById('searchInput').value = '';
        
        const cards = document.querySelectorAll('.card-item');
        cards.forEach(cardEl => {
            cardEl.style.display = 'block';
        });
    }

    findCardById(cardId) {
        for (const column of this.currentProject.columns) {
            const card = column.cards.find(c => c.id === cardId);
            if (card) return card;
        }
        return null;
    }

    // Labels management
    renderLabels() {
        // This method can be expanded if we want to add label management UI
    }

    // Modal management
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        
        // Reset form if needed
        const form = modal.querySelector('form');
        if (form) form.reset();
        
        // Clear comment input
        const commentInput = document.getElementById('newCommentInput');
        if (commentInput) commentInput.value = '';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.gamaApp = new GamaApp();
});