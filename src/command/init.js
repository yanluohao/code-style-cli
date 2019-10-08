// 命令管理
const commander = require("commander");
// 命令行交互工具
const inquirer = require("inquirer");
// 命令行中显示加载中
const ora = require("ora");
const Git = require("../tools/git");
const { existsSync } = require("fs");
const chalk = require("chalk");

class Download {
  constructor() {
    this.git = new Git();
    this.commander = commander;
    this.inquirer = inquirer;
    this.getProList = ora("获取项目模板列表...");
    this.getTagList = ora("获取项目模板版本...");
    this.downLoad = ora("正在为您下载代码...");
  }

  run() {
    this.commander.parse(process.argv);
    this.getTemplatePath();
  }
  getTemplatePath() {
    const path = process.argv[3];
    if (!path) {
      this.inquirer
        .prompt([
          {
            type: "confirm",
            name: "currentPath",
            message: "确定在当前目录下生成项目模板吗？",
            default: false,
            when(val) {
              if (!val) {
                process.exit(-1);
                return false;
              } else {
                return true;
              }
            }
          }
        ])
        .then(({ currentPath }) => {
          if (!currentPath) return;
          this.targetPath = "";
          this.download();
        });
    } else {
      if (existsSync(path)) {
        console.error(chalk.red("当前目录已存在相同的项目名称"));
        return;
      }
      this.targetPath = path;
      this.download();
    }
  }
  async download() {
    let getProListLoad;
    let getTagListLoad;
    let downLoadLoad;
    let repos;
    let version;

    // 获取所在项目组的所有可选的项目模板列表
    try {
      getProListLoad = this.getProList.start();
      repos = await this.git.getProjectList();
      repos = repos.projects;
      getProListLoad.succeed("获取项目模板列表成功");
    } catch (error) {
      console.log(error);
      getProListLoad.fail("获取项目列表失败...");
      process.exit(-1);
    }

    // 向用户咨询他想要开发的项目
    if (repos.length === 0) {
      console.log("\n可以开发的项目数为 0, 请联系开发人员添加模板~~\n".red);
      process.exit(-1);
    }

    const choices = repos.map(({ name, id }) => {
      return {
        name,
        id
      };
    });
    const questions = [
      {
        type: "list",
        name: "repo",
        message: "请选择你想要开发的项目类型",
        choices
      }
    ];
    const { repo } = await this.inquirer.prompt(questions);
    // 获取项目id
    let repoId;
    choices.forEach(choice => {
      if (choice.name == repo) {
        repoId = choice.id;
      }
    });
    // 获取项目的版本, 这里默认选择确定项目的最近一个版本
    try {
      getTagListLoad = this.getTagList.start();
      [{ name: version }] = await this.git.getProjectVersions(repoId);
      getTagListLoad.succeed("获取项目版本成功");
    } catch (error) {
      console.log(error);
      getTagListLoad.fail("获取项目版本失败...");
      process.exit(-1);
    }

    // // 向用户咨询欲创建项目的目录
    // const repoName = [
    //   {
    //     type: "input",
    //     name: "repoPath",
    //     message: "请输入项目名称~",
    //     default: "我的项目",
    //   }
    // ];
    // const { repoPath } = await this.inquirer.prompt(repoName);

    // 下载代码到指定的目录下
    try {
      downLoadLoad = this.downLoad.start();
      if (this.targetPath) {
        await this.git.downloadProject({
          repo,
          version,
          repoPath: this.targetPath
        });
      } else {
        await this.git.downloadProjectCurrent({
          repo,
          version
        });
      }

      downLoadLoad.succeed("下载代码成功");
      console.log("\n To get started");
      console.log(
        `\n ${this.targetPath ? `cd ${this.targetPath} & ` : ""}npm i \n`
      );
    } catch (error) {
      console.log(error);
      downLoadLoad.fail("下载代码失败...");
    }
  }
}
const D = new Download();
D.run();
