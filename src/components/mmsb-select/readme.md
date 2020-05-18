# my-component



<!-- Auto Generated Below -->


## Properties

| Property         | Attribute          | Description | Type                       | Default     |
| ---------------- | ------------------ | ----------- | -------------------------- | ----------- |
| `boldOnSelected` | `bold-on-selected` |             | `boolean`                  | `false`     |
| `color`          | `color`            |             | `string`                   | `undefined` |
| `data`           | --                 |             | `[string, string][]`       | `[]`        |
| `height`         | `height`           |             | `string`                   | `"250px"`   |
| `is_open`        | `is_open`          |             | `boolean`                  | `false`     |
| `label`          | `label`            |             | `string`                   | `""`        |
| `multiple`       | `multiple`         |             | `boolean`                  | `false`     |
| `onSelect`       | --                 |             | `(select: string) => void` | `undefined` |
| `onUnselect`     | --                 |             | `(select: string) => void` | `undefined` |
| `selected`       | --                 |             | `string[]`                 | `[]`        |


## Events

| Event                  | Description | Type                  |
| ---------------------- | ----------- | --------------------- |
| `mmsb-select.select`   |             | `CustomEvent<string>` |
| `mmsb-select.unselect` |             | `CustomEvent<string>` |


## Methods

### `getSelected() => Promise<string | string[]>`



#### Returns

Type: `Promise<string | string[]>`




----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
