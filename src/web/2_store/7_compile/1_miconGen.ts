import { Obj } from "~/types";
import { Wire, eqPortKey, wireName } from "~/web/1_type";
import { cpp } from "./3_cppGen";
import { VInstance, VWire, verilog } from "./2_verilogGen";
import { ObjResolveExt } from "../3_selector/1_obj";

// ------------------------------------------------------------------------------------------------
// 置換リスト

export const genReplace = (objs: Obj<ObjResolveExt>[], wires: Wire[]): Record<string, string> => {
  return {
    includes: genIncludes(objs),
    declarations: genDeclarations(objs),
    definitions: genDefinitions(objs),
    iopin: genIOPort(objs),
    iobuffer: genIOBuffer(objs, wires),
    irq: genIRQ(objs, wires),
    instances: genInstances(objs, wires),
    mem_ready: genMemReady(objs),
    mem_rdata: genMemRdata(objs),
  };
};

// ------------------------------------------------------------------------------------------------
// ファームウェア

// TODO 依存関係解決と重複除去

const genIncludes = (instances: Obj<ObjResolveExt>[]) =>
  instances
    .flatMap((node) => (node.obj === "Inst" && node.addr ? [cpp.include(`${node.mod.join("/")}/${node.mod[1]}.hpp`)] : []))
    .join("\n");

const genDeclarations = (instances: Obj<ObjResolveExt>[]) =>
  instances.flatMap((node) => (node.obj === "Inst" && node.addr ? [cpp.declaration(node.mod[1], node.name)] : [])).join("\n");

const genDefinitions = (instances: Obj<ObjResolveExt>[]) =>
  instances
    .flatMap((node) =>
      node.obj === "Inst" && node.addr ? [cpp.instantiation(node.mod[1], node.name, `(volatile uint32_t*)0x${node.addr}00'0000`)] : [],
    )
    .join("\n");

// ------------------------------------------------------------------------------------------------
// ハードウェア

const genIOPort = (objs: Obj<ObjResolveExt>[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Port") {
        if (obj.variant === "In") return [`    input  ${name}`];
        if (obj.variant === "Out") return [`    inout  ${name}`];
        if (obj.variant === "InOut") return [`    output ${name}`];
      }
      return [];
    })
    .join(",\n");
};

const genIOBuffer = (objs: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Port") {
        if (obj.variant === "InOut") {
          // IOSEL に接続されているワイヤを探す
          const ioselWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "iosel"]));
          if (!ioselWire) {
            console.error(`Open Port: ${obj.name}.iosel`);
            return [];
          }
          // OUT に接続されているワイヤを探す
          const outWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "out"]));
          if (!outWire) {
            console.error(`Open Port: ${obj.name}.out`);
            return [];
          }
          // IN に接続されているワイヤを定義する
          const inWire = verilog.wire({ name: wireName([obj.name, "in"]), width: 1 });
          // IOバッファの生成
          const iobuf = verilog.instance({
            module: "InOut",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "iosel", wire: wireName(ioselWire.first) },
              { port: "out", wire: wireName(outWire.first) },
              { port: "in", wire: wireName([obj.name, "in"]) },
            ],
          });
          return [iobuf, inWire];
        } else if (obj.variant === "In") {
          // IN に接続されているワイヤを定義する
          const inWire = verilog.wire({ name: wireName([obj.name, "in"]), width: 1 });
          // IOバッファの生成
          const iobuf = verilog.instance({
            module: "In",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "in", wire: wireName([obj.name, "in"]) },
            ],
          });
          return [iobuf, inWire];
        } else if (obj.variant === "Out") {
          // OUT に接続されているワイヤを探す
          const outWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "out"]));
          if (!outWire) {
            console.error(`Open Port: ${obj.name}.out`);
            return [];
          }
          // IO バッファの生成
          const iobuf = verilog.instance({
            module: "Out",
            instance: `${obj.name}_iobuf`,
            params: [],
            ioport: [
              { port: "pin", wire: obj.name },
              { port: "out", wire: wireName(outWire.first) },
            ],
          });
          return [iobuf];
        }
      } else return [];
    })
    .join("\n");
};

const genIRQ = (objs: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return objs
    .flatMap((obj) => {
      if (obj.obj === "Irq") {
        const irqWire = wires.find((wire) => eqPortKey(wire.last, [obj.name, "irq"]));
        if (!irqWire) {
          console.error(`Open Port: ${obj.name}.irq`);
          return [];
        }
        const irqNo = obj.name.slice(3);
        return [`      irq[${irqNo}] = ${wireName(irqWire.first)};`];
      } else return [];
    })
    .join("\n");
};

const genInstances = (instances: Obj<ObjResolveExt>[], wires: Wire[]) => {
  return instances
    .flatMap((obj) => {
      if (obj.obj === "Inst") {
        let vwires: VWire[] = [];
        let vinst: VInstance = {
          instance: obj.name,
          module: obj.pack.name,
          // Basic Connections
          ioport: [
            { port: "clk", wire: "clk" },
            { port: "resetn", wire: "resetn" },
          ],
          params: [], // TODO
        };

        // Memory Map Connections
        if (obj.addr) {
          vinst.ioport = [
            ...vinst.ioport,
            { port: "valid", wire: `${obj.name}_valid` },
            { port: "ready", wire: `${obj.name}_ready` },
            { port: "wstrb", wire: `${obj.name}_valid ? mem_wstrb : 4'b0` },
            { port: "addr", wire: "mem_addr" },
            { port: "wdata", wire: "mem_wdata" },
            { port: "rdata", wire: `${obj.name}_rdata` },
          ];
          vwires = [
            ...vwires,
            { name: `${obj.name}_sel`, width: 1, init: `mem_addr[31:24] == 8'h${obj.addr}` },
            { name: `${obj.name}_valid`, width: 1, init: `mem_valid && ${obj.name}_sel` },
            { name: `${obj.name}_ready`, width: 1 },
            { name: `${obj.name}_rdata`, width: 32 },
          ];
        }

        // IO Connections
        // pack.ports.forEach((port) => {
        //   if (port.direct === "input") {
        //     const wire = wires.find(({ last: to }) => eqPortKey(to, [name, port.name]));
        //     if (wire) {
        //       vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName(wire.first) }];
        //       return;
        //     }
        //     if (!wire) {
        //       console.log(`Open port: ${name}.${port.name}`);
        //       vinst.ioport = [...vinst.ioport, { port: port.name, wire: verilog.const({ width: port.width, value: 0 }) }];
        //       return;
        //     }
        //   }

        //   if (port.direct === "output") {
        //     const wire = wires.find(({ first: from }) => eqPortKey(from, [name, port.name]));
        //     if (wire) {
        //       const typeCheck = wire.width == port.width;
        //       if (typeCheck) {
        //         vwires = [...vwires, { name: wireName([name, port.name]), width: port.width }];
        //         vinst.ioport = [...vinst.ioport, { port: port.name, wire: wireName([name, port.name]) }];
        //         return;
        //       } else {
        //         console.log(`Invalid width: ${name}.${port.name}`);
        //         return;
        //       }
        //     }
        //     if (!wire) {
        //       console.log(`Open port: ${name}.${port.name}`);
        //       return;
        //     }
        //   }
        // });

        return [verilog.instance(vinst), ...vwires.map(verilog.wire)].join("\n");
      } else return [];
    })
    .join("\n\n");
};

const genMemReady = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) => {
      if (obj.obj === "Inst" && obj.pack.software) {
        return [`, ${obj.name}_ready`];
      } else return [];
    })
    .join("");

const genMemRdata = (objs: Obj<ObjResolveExt>[]) =>
  objs
    .flatMap((obj) => {
      if (obj.obj === "Inst" && obj.pack.software) {
        return [`: ${name}_ready ? ${name}_rdata`];
      } else return [];
    })
    .join("");
