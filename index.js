function createCommandLine(block, prompt) {
  return '<span class="shell-line shell-command-line">' + prompt +
         '<span class="shell-command">' + (block.body || '').trim() +
         '</span></span>';
}

function createLogLines(block) {
  var block_lines = block.body.split('\n');
  var lines = [];

  if (block_lines[0] == '') {
    block_lines.shift();
  }

  if (block_lines[block_lines.length - 1].trim() == '') {
    block_lines.pop();
  }

  for (var i = 0; i < block_lines.length; i++) {
    lines.push('<span class="shell-line shell-log-line shell-' +
               block.name.trim() + '">' + escapeHTML(block_lines[i]) + '</span>');
  }

  return lines.join('\n');
}

function createPrompt(block) {
  var text = block.args.join(' ');
  var prompt = '<span class="shell-prompt">' + (block.args[0] || '');

  if ('path' in block.kwargs) {
    prompt += createPromptComponent('path', block.kwargs['path']);
    prompt += (block.args[1] || '');
  }

  if ('delimiter' in block.kwargs) {
    prompt += createPromptComponent('delimiter', block.kwargs['delimiter']);
  }

  return prompt + '</span>';
}

function createPromptComponent(key, value) {
  return '<span class="shell-' + key + '">' + value + '</span>';
}

function escapeHTML(html_str) {
  return html_str.replace(/[&<>"]/g, function (tag) {
    var chars_to_replace = {
        '&': '&ampl;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
    };

    return chars_to_replace[tag] || tag;
  });
}

module.exports = {

  book: {
    assets: './assets',
    css: [
      'shell.css'
    ]
  },

  blocks: {
    shell: {
      blocks: [
        'command',
        'error',
        'info',
        'prompt',
        'warning'
      ],

      process: function(block) {
        var disabled = '';
        if ('disable' in block.kwargs) {
          disabled = block.kwargs['disable'].split(' ').map(x => 'shell-no-' + x).join(' ');
        }

        var lines = [];
        var prompt = '';
        var style = 'shell-' + (block.kwargs['style'] || 'modern');

        block.blocks.forEach(function(sub_block) {
          switch(sub_block.name) {
            case 'command':
              lines.push(createCommandLine(sub_block, prompt));
              break;
            case 'prompt':
              prompt = createPrompt(sub_block);
              break;
            case 'error':
            case 'info':
            case 'warning':
              lines.push(createLogLines(sub_block));
              break;
          }
        });

        return '<div class="shell ' + style + ' ' + disabled +
               '">' + lines.join('\n') + '</div>';
      }
    }
  }

};
