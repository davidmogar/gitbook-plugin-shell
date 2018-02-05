function create_command_line(block, prompt) {
  return '<span class="shell-line">' + prompt +
         '<span class="shell-command">' + (block.args[0] || '').trim() +
         '</span></span>';
}

function create_log_lines(block) {
  var block_lines = block.body.split('\n');
  var lines = [];
  
  if (block_lines[0] == '') {
    block_lines.shift();
  }

  if (block_lines[block_lines.length - 1].trim() == '') {
    block_lines.pop();
  }

  for (var i = 0; i < block_lines.length; i++) {
    lines.push('<span class="shell-line shell-' +
               block.name.trim() + '">' +
               block_lines[i] + '</span>');
  }

  return lines.join('\n');
}

function create_prompt(block) {
  var text = block.args.join(' ');
  var prompt = '<span class="shell-prompt">' + block.args.join(' ');
  
  for (var key in block.kwargs) {
    if (key == 'delimiter' || key == 'path') {
      prompt += '<span class="shell-' + key + '">' + block.kwargs[key] + '</span>';
    }
  }

  return prompt + '</span>';
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
          var lines = [];
          var prompt;

        block.blocks.forEach(function(sub_block) {
          switch(sub_block.name) {
            case 'command':
              lines.push(create_command_line(sub_block, prompt));
              break;
            case 'prompt':
              prompt = create_prompt(sub_block);
              break;
            case 'error':
            case 'info':
            case 'warning':
              lines.push(create_log_lines(sub_block));
              break;
          }
        });

        return '<div class="shell">' + lines.join('\n') + '</div>';
      }
    }
  }

};
