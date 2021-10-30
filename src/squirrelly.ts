import * as Sqrl from 'squirrelly';

const myTemplate = `This is {{it.name}}
{{ @if (it.author) }}
written by {{it.author}}
{{/if}}`;

const data = {
  name: 'Foo',
  author: 'Clem',
};

const result = Sqrl.render(myTemplate, data);
console.log(result);
