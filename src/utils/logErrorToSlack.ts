import { Request } from 'express';
import axios from 'axios';
import { CONFIG } from '../config';

const codeBlock = `\r\n\`\`\`\r\n`;

const slackHook = CONFIG.slackHook;

function replaceUrlsInText(textWithUrl: string): string {
  let output = textWithUrl;
  if (output && typeof output === 'string') {
    output = output.split('https://').join('https :// _');
    output = output.split('http://').join('http :// _');
    output = output.split('www.').join('www . _');
  }
  return output;
}

interface SlackBlock {
  block_id: string;
  type: 'section' | 'context';
  text?: { text: string; type: 'mrkdwn' | 'plain_text' };
  elements?: Array<{ text: string; type: 'mrkdwn' | 'plain_text' }>;
}

async function sendErrorsToSlack(title: string, descriptionParam: any, error: any, req: Request): Promise<void> {
  const blocks: SlackBlock[] = [];
  blocks.push({
    block_id: 'title',
    type: 'section',
    text: { text: `*${replaceUrlsInText(title)}*`, type: 'mrkdwn' },
  });

  let description = replaceUrlsInText(descriptionParam);
  if (descriptionParam && typeof descriptionParam === 'object') {
    description = JSON.stringify(descriptionParam);
  }

  if (descriptionParam) {
    blocks.push({
      block_id: 'description',
      type: 'context',
      elements: [{ text: description, type: 'plain_text' }],
    });
  }

  const attachments: Array<{ blocks: SlackBlock[] }> = [];
  if (req) {
    const elements: SlackBlock['elements'] = [];

    elements.push({
      type: 'mrkdwn',
      text: `*Request:*${codeBlock}${req.method}: ${req.hostname}${req.originalUrl}\r\r${
        req.body ? replaceUrlsInText(JSON.stringify(req.body)) : ''
      }${codeBlock}`,
    });

    blocks.push({
      block_id: 'request',
      type: 'context',
      elements,
    });
  }

  if (error) {
    const attachmentBlocks: SlackBlock[] = [];
    const errorMessage = error && (typeof error === 'string' ? error : error.message || '');
    attachmentBlocks.push({
      block_id: 'error-message',
      type: 'section',
      text: {
        text: `\`${replaceUrlsInText(errorMessage)}\``.substring(0, 3000),
        type: 'mrkdwn',
      },
    });

    if (error?.response?.data) {
      attachmentBlocks.push({
        block_id: 'error-details',
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Error: Body:* ${codeBlock}${replaceUrlsInText(JSON.stringify(error.response.data))}${codeBlock}`.substring(0, 3000),
          },
        ],
      });
    }

    if (error.stack) {
      let { stack } = error;
      if (stack.length > 2900) {
        stack = `${stack.substring(0, 500)}...\n\n${stack.substring(stack.length - 2500)}`;
      }
      attachmentBlocks.push({
        block_id: 'error-stack',
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: `*Stack:* ${codeBlock}${replaceUrlsInText(stack)}${codeBlock}`,
          },
        ],
      });
    }
    attachments.push({ blocks: attachmentBlocks });
  }

  const slackBody = {
    blocks,
    attachments,
    text: replaceUrlsInText(`${title}\r\n${error?.message || ''}`).substring(0, 100),
  };

  await axios.post(slackHook, slackBody);
}

export { sendErrorsToSlack };
