const download = require("download-git-repo");
const request = require("./request");
const { orgName, baseURL } = require("../../config");
const exec = require("child_process").exec;

class Git {
  constructor() {
    this.orgName = orgName;
  }

  /**
   * 获取项目组中的项目模板列表
   */
  getProjectList() {
    return request(`/groups/${this.orgName}`);
  }

  /**
   * 获取项目模板的版本列表
   * @param {String} repoId 项目id
   */
  getProjectVersions(repoId) {
    return request(`/projects/${repoId}/repository/tags`);
  }

  /**
   * 下载 github 项目
   * @param {Object} param 项目信息 项目名称 项目版本 本地开发目录
   */
  downloadProject({ repo, version, repoPath }) {
    return new Promise((resolve, reject) => {
      download(
        `${baseURL}:${this.orgName}/${repo}#${version}`,
        repoPath,
        { clone: true },
        err => {
          if (err) reject(err);
          resolve(true);
        }
      );
    });
  }
  /**
   * 下载到当前目录
   */
  downloadProjectCurrent({ repo, version }) {
    return new Promise((resolve, reject) => {
      exec(
        `git clone --branch ${version} ${baseURL}/${this.orgName}/${repo}.git .`,
        function(err) {
          if (err) {
            if (err.code == 128) {
              reject(
                "destination path '.' already exists and is not an empty directory"
              );
            } else {
              reject(`error: ${err.cmd}`);
            }
          } else {
            resolve(true);
          }
        }
      );
    });
  }
}

module.exports = Git;
