import Docker from "dockerode";
const docker = new Docker({
  host: process.env.DOCKER_IP || "10.53.19.10",
  port: process.env.DOCKER_PORT || 2375,
  version: "v1.25",
});

export async function POST() {
  docker.createContainer(
    {
      Image: "alpine",
      Cmd: ["echo", "hello world"],
    },
    function (err, container) {
        if (!container) return;
      container.start(function (err, data) {
        console.log(data);
      });
    }
  );
}