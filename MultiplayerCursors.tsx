import { useEffect } from "react";
import { io } from "socket.io-client";
import { useStore } from "../../store/useStore";
import { Billboard, Text, Sphere } from "@react-three/drei";

const socket = io();

export function MultiplayerCursors() {
  const handPosition = useStore((state) => state.handPosition);
  const remoteUsers = useStore((state) => state.remoteUsers);
  const setRemoteUsers = useStore((state) => state.setRemoteUsers);

  useEffect(() => {
    socket.on("users:update", (users) => {
      setRemoteUsers(users);
    });

    return () => {
      socket.off("users:update");
    };
  }, [setRemoteUsers]);

  useEffect(() => {
    if (handPosition) {
      socket.emit("cursor:move", handPosition);
    }
  }, [handPosition]);

  return (
    <>
      {Object.entries(remoteUsers).map(([id, data]) => {
        // Don't show ourselves
        if (id === socket.id) return null;
        
        return (
          <group key={id} position={[data.x, data.y, data.z]}>
            <Sphere args={[0.3, 16, 16]}>
              <meshBasicMaterial color={data.color} transparent opacity={0.6} />
            </Sphere>
            <Billboard>
              <Text
                position={[0, 0.6, 0]}
                fontSize={0.3}
                color={data.color}
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf"
              >
                Explorer
              </Text>
            </Billboard>
          </group>
        );
      })}
    </>
  );
}
