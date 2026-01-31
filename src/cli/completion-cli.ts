import type { Command } from "commander";
import { defaultRuntime } from "../runtime.js";

export function registerCompletionCli(program: Command) {
  program
    .command("completion")
    .description("Generate shell completion scripts")
    .addHelpText("after", "\nExample: moltbot completion zsh > ~/.zshrc.d/_moltbot\n")
    .argument("<shell>", "Shell type (bash, zsh, fish, powershell)")
    .action(async (shell: string) => {
      const bin = "moltbot";
      
      switch (shell.toLowerCase()) {
        case "bash":
          process.stdout.write(generateBashCompletion(bin));
          break;
        case "zsh":
          process.stdout.write(generateZshCompletion(bin));
          break;
        case "fish":
          process.stdout.write(generateFishCompletion(bin));
          break;
        case "powershell":
          process.stdout.write(generatePowerShellCompletion(bin));
          break;
        default:
          defaultRuntime.error(`Unsupported shell: ${shell}`);
          process.exit(1);
      }
    });
}

function generateBashCompletion(bin: string): string {
  return `
_${bin}_completion() {
    local cur prev opts
    COMPREPLY=()
    cur="\${COMP_WORDS[COMP_CWORD]}"
    prev="\${COMP_WORDS[COMP_CWORD-1]}"
    opts="$(${bin} --help | sed -n '/Commands:/,$p' | grep -E '^  [a-z]' | awk '{print $1}')"

    if [[ \${cur} == -* ]] ; then
        COMPREPLY=( $(compgen -W "--help --version --dev --profile --no-color" -- "\${cur}") )
        return 0
    fi

    COMPREPLY=( $(compgen -W "\${opts}" -- "\${cur}") )
}
complete -F _${bin}_completion ${bin}
`;
}

function generateZshCompletion(bin: string): string {
  return `
#compdef ${bin}
_${bin}() {
    local -a commands
    commands=(\$(${bin} --help | sed -n '/Commands:/,$p' | grep -E '^  [a-z]' | awk '{print $1 ":" $0}' | sed 's/^  //'))
    _arguments '1: :->command' '*: :->args'
    case \$state in
        command)
            _describe -t commands 'command' commands
            ;;
    esac
}
_${bin} "$@"
`;
}

function generateFishCompletion(bin: string): string {
  return `
function __fish_${bin}_no_subcommand
    set -l cmd (commandline -opc)
    if [ (count \$cmd) -eq 1 ]
        return 0
    end
    return 1
end

complete -c ${bin} -f -n "__fish_${bin}_no_subcommand" -a "(${bin} --help | sed -n '/Commands:/,$p' | grep -E '^  [a-z]' | awk '{print \$1}')"
`;
}

function generatePowerShellCompletion(bin: string): string {
  return `
Register-ArgumentCompleter -Native -CommandName ${bin} -ScriptBlock {
    param(\$wordToComplete, \$commandAst, \$cursorPosition)
    \$commands = ${bin} --help | Out-String | ForEach-Object { if (\$_ -match '^  ([a-z]+)') { \$matches[1] } }
    \$commands | Where-Object { \$_ -like "\$wordToComplete*" } | ForEach-Object {
        [System.Management.Automation.CompletionResult]::new(\$_, \$_, 'ParameterValue', \$_)
    }
}
`;
}
