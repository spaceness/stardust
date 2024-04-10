{
  description = "Stardust";
  inputs = {
    nixpkgs = {
      url = "github:NixOS/nixpkgs/nixos-unstable";
    };
    flake-utils = {
      url = "github:numtide/flake-utils";
    };
  };
  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = { };
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = with pkgs; [
            nodePackages_latest.nodejs
            nodePackages_latest.node-gyp
            python3
            pkgs.nodePackages_latest.pnpm
            postgresql_13 # needed for some DB service commands
            docker
          ];
        };
      }
    );
}
