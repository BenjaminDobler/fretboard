import { Meta, Story } from '@storybook/angular';
import { ComponentsComponent } from './components.component';


export default {
  /* 👇 The title prop is optional.
  * See https://storybook.js.org/docs/angular/configure/overview#configure-story-loading
  * to learn how to generate automatic titles
  */
  title: 'Button',
  args: {
    label: 'My Button'
  },
  argTypes: {
    label: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
  component: ComponentsComponent,
} as Meta;

export const Primary: Story = () => ({
  props: {
    label: 'Button',
    primary: true,
  },
});