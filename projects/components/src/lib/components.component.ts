import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-components',
  template: `
    <p>
      {{label}}
    </p>
  `,
  styles: [
  ]
})
export class ComponentsComponent implements OnInit {

  @Input()
  public label: string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
