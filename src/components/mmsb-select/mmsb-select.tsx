import { Component, Prop, h, State, Watch, Element, Event, EventEmitter, Method } from '@stencil/core';

@Component({
  tag: 'mmsb-select',
  styleUrl: 'mmsb-select.css',
  shadow: true
})
export class MmsbSelect {
  protected readonly hide_fn = (e: Event) => {
    const event_path = e.composedPath() as HTMLElement[];

    if (event_path.some(element => element.dataset && element.dataset.rootSelectId === String(this.id))) {
      return;
    }

    // Close
    this.hide();
  }; 

  @Element() el: HTMLElement;

  @Prop() data: [string, string][] = [];
  @Prop() multiple = false;
  @Prop() label = "";
  @Prop() selected: string[] = [];
  @Prop() is_open = false;
  @Prop() height = "250px";

  @Event({
    eventName: 'mmsb-select.select'
  }) selectItem: EventEmitter<string>;

  @Event({
    eventName: 'mmsb-select.unselect'
  }) unselectItem: EventEmitter<string>;

  protected readonly id = Math.random();

  @State()
  internal_data: { [id: string]: string } = {};
  @State()
  search_content: string = "";

  @Watch('data')
  setInternal(data: [string, string][]) {
    const tmp = {};
   
    for (const [id, label] of data) {
      tmp[id] = label;
    }

    this.internal_data = tmp;

    if (this.selected.length) {
      const tmp = [];
      for (const id of this.selected) {
        if (id in this.internal_data) {
          tmp.push(id);
        }
      }
      this.selected = tmp;
    }
    else {
      if (data.length && !this.multiple) {
        this.selected = [data[0][0]];
      }
      else {
        this.selected = [];
      }
    }
  }

  @Method()
  async getSelected() {
    if (this.multiple) {
      return this.selected;
    }
    return this.selected[0];
  }

  open() {
    this.is_open = true;
    const root = this.el.shadowRoot.querySelector('.select-root') as HTMLElement;
    
    setTimeout(() => {
      window.addEventListener('click', this.hide_fn);
      root.style.opacity = "1";
      root.querySelector('input').focus();
    }, 50);
  }

  hide() {
    window.removeEventListener('click', this.hide_fn);

    const root = this.el.shadowRoot.querySelector('.select-root') as HTMLElement;
    root.style.opacity = "0";
    setTimeout(() => {
      this.is_open = false;
    }, 150)
  }

  refreshSearch(e: Event) {
    this.search_content = (e.currentTarget as HTMLInputElement).value;
  }

  selectSth(e: Event) {
    const id = (e.currentTarget as HTMLElement).dataset.id;

    if (this.multiple) {
      if (this.selected.includes(id)) {
        const s = new Set(this.selected);
        s.delete(id);
        this.selected = [...s];
        this.unselectItem.emit(id);
      }
      else {
        this.selected = [...this.selected, id];
        this.selectItem.emit(id);
      }
    }
    else {
      this.selected = [id];
      this.selectItem.emit(id);
      this.hide();
    }
  }
  
  renderSelect() {
    const elements = [];

    const search = escapeRegExp(this.search_content);

    const regex = new RegExp('(' + search + ')', 'i');

    for (let [id, label] of this.data) {
      if (this.search_content) {
        label = escapeHTML(label);

        if (!label.match(regex)) {
          continue;
        }
        else {
          label = label.replace(regex, '<span class="bright">$1</span>');
        }
      }

      elements.push(
        <div data-id={id} data-label={label} class={(this.selected.includes(id) ? "active" : "") + " select-item"} onClick={e => this.selectSth(e)}>
          <div innerHTML={label} />
        </div>
      );
    }

    return (
      <div class="select-root" style={{'max-height': this.height, 'visibility': this.is_open ? 'visible' : 'hidden', 'pointer-events': this.is_open ? '' : 'none', opacity: '0'}}>
        <div class="input-wrapper">
          <input type="text" placeholder="Search..." onInput={e => this.refreshSearch(e)} value={this.search_content}></input>
        </div>

        <div class="select-list">
          {elements}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div class="container" data-root-select-id={String(this.id)}>
        <div class="label-container" onClick={() => this.open()}>
          <div class="label ellipsis">
            &#9656; {this.selected.length ? this.selected.map(e => this.internal_data[e]).join(', ') : this.label}
          </div>
        </div>
        {this.renderSelect()}
      </div>
    ); 
  }
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const escape = document.createElement('textarea');
function escapeHTML(html: string) {
  escape.textContent = html;
  return escape.innerHTML;
}

function unescapeHTML(html: string) {
  escape.innerHTML = html;
  return escape.textContent;
}
