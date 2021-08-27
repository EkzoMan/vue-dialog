let modalDialog = Vue.component('modal', {
    template: `
        <div class="modal" :id="'modal-dialog' + uid" v-show="Show" :class="'modal-' + Theme"  ref="draggableContainer" >
            <div class="modal__wrapper"></div>
            <div class="modal__container draggable">
                <div class="modal__header" v-html="Title" @mousedown="dragMouseDown">
                    {{ Title }}
                </div>
                <div class="modal__content">
                    <slot></slot>
                    <div ref="contentContainer"></div>
                </div>
                <div class="modal__controls" v-if="ShowOk && ShowClose">
                    <button v-on:click="CloseCallback" ref="closebtn" v-show="ShowClose" class="modal__button modal__close-btn">{{CancelText}}</button>
                    <button autofocus ref="okbtn" v-on:click="OkCallback()" v-show="ShowOk" class="modal__button modal__confirm-btn" :class="Theme">{{OkText}}</button>
                </div>
            </div>
        </div>`,
    props: {
        Title: String,
        Content: HTMLDivElement,
        Theme: String,
        OkText: String,
        CancelText: String,
        ShowOk: Boolean,
        ShowClose: Boolean,
        AdditionalClasses: String,
        OkCallback: Function,
        AutoShow: Boolean,
        Parent: Object
    },
    data() {
        return {
            Show: false,
            positions: {
                clientX: undefined,
                clientY: undefined,
                movementX: 0,
                movementY: 0
            },
            uid: undefined
        }
    },
    created() {
        this.uid = Math.round(Math.random() * 10000);
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            var comp = this;
            document.addEventListener('keyup', function (e) {
                if (comp.Show && e.keyCode == 27)
                    comp.CloseCallback();
            });
            
            if (this.Theme === undefined || this.Theme.length === 0)
                this.Theme = 'default';
            else
                this.Theme = this.Theme.toLocaleLowerCase();

            this.ShowClose = this.ShowClose !== undefined ? this.ShowClose : true;
            this.ShowOk = this.ShowOk !== undefined ? this.ShowOk : true;
            this.OkCallback = this.OkCallback !== undefined ? this.OkCallback : function () { comp.CloseCallback(); };
            this.OkText = this.OkText !== undefined && this.OkText.length > 0 ? this.OkText : 'Ok';
            this.CancelText = this.CancelText !== undefined && this.CancelText.length > 0 ? this.CancelText : 'Закрыть';
            this.AdditionalClasses = this.AdditionalClasses !== undefined && this.AdditionalClasses.length > 0 ? this.AdditionalClasses : '';
            this.$refs.contentContainer.replaceWith(this.Content);
            this.AutoShow = this.AutoShow !== undefined && this.AutoShow !== null ? this.AutoShow : false;
            if (this.AutoShow)
                this.Open();

            if (this.Parent !== undefined && this.Parent !== null) {
                this.Parent.$children.push(this);
                this.Parent.$el.appendChild(this.$el);
            }
        },
        CloseCallback: function () {
            this.Close();
        },
        Close: function () {
            if (this.Parent !== undefined && this.Parent !== null) {
                this.Parent.$children.splice(this.Parent.$children.indexOf(this), 1);
                this.Parent.$el.removeChild(this.$el);
            }
            else
                window.document.getElementById('modal-dialog' + this.uid).remove();
        },
        Open: function () {
            this.Show = true;
            var dialog = this.$el;
            dialog.className = "";
            dialog.classList.add("modal");
            dialog.classList.add("modal-" + this.Theme);
            if (this.AdditionalClasses.length > 0)
                dialog.classList.add(this.AdditionalClasses);
            if (this.ShowOk)
                this.$refs.okbtn.focus();
            else if (!this.ShowOk && this.ShowClose)
                this.$refs.closebtn.focus();
        },
        appendTo: (Parent) => {
            if (Parent !== undefined && Parent !== null) {
                Parent.$children.push(this);
                Parent.$el.appendChild(this.$el);
            }
        },
        dragMouseDown: function (event) {
            event.preventDefault()
            // get the mouse cursor position at startup:
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            document.onmousemove = this.elementDrag
            document.onmouseup = this.closeDragElement
        },
        elementDrag: function (event) {
            event.preventDefault()
            this.positions.movementX = this.positions.clientX - event.clientX
            this.positions.movementY = this.positions.clientY - event.clientY
            this.positions.clientX = event.clientX
            this.positions.clientY = event.clientY
            // set the element's new position:
            this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
            this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
        },
        closeDragElement() {
            document.onmouseup = null
            document.onmousemove = null
        }
    },
    computed: {

    }
});