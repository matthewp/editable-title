# &lt;editable-title&gt;

The `<editable-title>` component allows a title that can be modified.

```html
<editable-title>
  <h1>Title Here</h1>
</editable-title>
```

![showing off the component](https://user-images.githubusercontent.com/361671/51075088-d4841280-1654-11e9-8348-82d7a3459ce9.gif)


## Installation

```shell
npm install editable-title
```

## API

### [open]

`open` is available as both an attribute and a property. When the editable title is open it will display the edit mode. When it is not open, the title will be displayed.

```html
<editable-title open>
  <h1>Title Here</h1>
</editable-title>
```

Or modify the property:

```js
let editableTitle = document.querySelector('editable-title');

editableTitle.open = false;
```

### change event

Any time the title changes, a `change` event is fired. The `event.detail` contains a string of the new title.

```js
let editableTitle = document.querySelector('editable-title');

editableTitle.addEventListener('change', ev => {
  console.log('New title is', ev.detail);
});
```

## Styling

These variables are available:

### --input-height

Controls the `height` of the input.

### --input-width

Controls the `width` of the input.

### --input-font-size

Controls the `font-size` of the input.

### --input-outline

Controls the `outline` of the input.

### --button-font-size

Controls the `font-size` of all buttons.

### --button-background-color

Controls all buttons' `background-color` style.

### --button-border

Controls the border of all buttons.

## License

BSD-2-Clause