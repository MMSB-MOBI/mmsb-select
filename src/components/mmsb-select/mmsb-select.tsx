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
  }) unselectItem: EventEmitter<string>

  protected readonly id = Math.random();

  @State()
  internal_data: { [id: string]: string };
  @State()
  search_content: string = "";

  @Watch('data')
  setInternal(data: [string, string][]) {
    const tmp = {};
   
    for (const [id, label] of data) {
      tmp[id] = label;
    }

    this.internal_data = tmp;

    this.selected = [];

    if (data.length && !this.multiple) {
      this.selected = [data[0][0]];
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
    
    setTimeout(() => {
      window.addEventListener('click', this.hide_fn);


    }, 50);
  }

  hide() {
    this.is_open = false;
    window.removeEventListener('click', this.hide_fn);
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

    const regex = new RegExp(this.search_content, 'i');

    for (const [id, label] of this.data) {
      if (this.search_content) {
        if (!id.match(regex) && !label.match(regex)) {
          continue;
        }
      }

      elements.push(
        <div data-id={id} data-label={label} class={(this.selected.includes(id) ? "active" : "") + " select-item"} onClick={e => this.selectSth(e)}>
          {label}
        </div>
      );
    }

    return (
      <div class="select-root" style={{'max-height': this.height}}>
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
          <div class="label">
            &#9656; {this.selected.length ? this.selected.map(e => this.internal_data[e]).join(', ') : this.label}
          </div>
        </div>
        { this.is_open ? this.renderSelect() : "" }
      </div>
    ); 
  }
}
