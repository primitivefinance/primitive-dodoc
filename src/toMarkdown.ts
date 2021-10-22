/* eslint-disable guard-for-in, no-restricted-syntax */
import { ContractDocumentation } from './dodocTypes';

export default function toMarkdown(contractDocumentation: ContractDocumentation): string {
  let content: string = `# ${contractDocumentation.name}\n\n`;

  if (contractDocumentation.author) content += `*${contractDocumentation.author}*\n\n`;
  if (contractDocumentation.title) content += `> ${contractDocumentation.title}\n\n`;
  if (contractDocumentation.notice) content += `${contractDocumentation.notice}\n\n`;
  if (contractDocumentation.details) content += `*${contractDocumentation.details}*\n\n`;

  if (contractDocumentation.methods) {
    content += '## Methods\n\n';

    for (const methodName in contractDocumentation.methods) {
      content += `### \`${methodName}\`\n\n`;
      const method = contractDocumentation.methods[methodName];

      content += `\`\`\`${method.sig} ${method.stateMutability}\`\`\`\n\n`;

      if (method.notice) content += `${method.notice}\n\n`;
      if (method.details) content += `*${method.details}*\n\n`;

      if (method.params) {
        content += '#### Parameters\n\n';

        content += '| Name | Type | Description |\n';
        content += '|---|---|---|\n';

        for (const paramName in method.params) {
          content += `| ${paramName} | ${method.params[paramName].type} | ${method.params[paramName].description} |\n`;
        }

        content += '\n';
      }

      if (method.returns) {
        content += '#### Returns\n\n';

        content += '| Name | Type | Description |\n';
        content += '|---|---|---|\n';

        for (const returnName in method.returns) {
          content += `| ${returnName} | ${method.returns[returnName].type} | ${method.returns[returnName].description} |\n`;
        }

        content += '\n';
      }
    }
  }

  if (contractDocumentation.events) {
    content += '### Events\n\n';

    for (const eventName in contractDocumentation.events) {
      content += `### \`${eventName}\`\n\n`;
      const event = contractDocumentation.events[eventName];

      if (event.notice) content += `${event.notice}\n\n`;
      if (event.details) content += `*${event.details}*\n\n`;

      if (event.params) {
        content += '#### Parameters\n\n';

        content += '| Name | Type | Description |\n';
        content += '|---|---|---|\n';

        for (const paramName in event.params) {
          content += `| ${paramName} | ${event.params[paramName].type} | ${event.params[paramName].description} |\n`;
        }

        content += '\n';
      }
    }
  }

  return content;
}
