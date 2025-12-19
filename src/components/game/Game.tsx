import React, { useRef, useState, useEffect } from 'react';
import { View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { Text } from 'react-native-gesture-handler';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const GROUND_HEIGHT = 40;
const DINO_SIZE = 30;
const OBSTACLE_WIDTH = 24;
const OBSTACLE_HEIGHT = 36;

const GRAVITY = 0.5;
const JUMP_VELOCITY = 9;
const GAME_SPEED = 5;

const DINO_HITBOX_MARGIN = 6;
const OBSTACLE_HITBOX_MARGIN = 4;

const MIN_OBSTACLE_INTERVAL = 1200;
const MAX_OBSTACLE_INTERVAL = 2500;

const getRandomObstacleHeight = (height = 20) =>
  OBSTACLE_HEIGHT + Math.floor(Math.random() * height);

const getRandomInterval = (
  maxInterval: number = MAX_OBSTACLE_INTERVAL,
  minInterval: number = MIN_OBSTACLE_INTERVAL,
) => Math.floor(Math.random() * (maxInterval - minInterval)) + minInterval;

const Dino = ({ y }) => (
  <View style={[styles.dino, { bottom: y }]}>
    <FontAwesome5 name="bug" size={DINO_SIZE} color="#444" solid />
  </View>
);

const Obstacle = ({ x, height }) => (
  <View style={[styles.obstacle, { left: x, height, bottom: 0 }]}>
    <FontAwesome5 name="truck" size={OBSTACLE_WIDTH + 8} color="#666" solid />
  </View>
);

const Game = () => {
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'gameover'>(
    'ready',
  );
  const [obstacles, setObstacles] = useState([]);
  const [clouds, setClouds] = useState([]);
  const [_, setTick] = useState(0);

  const dinoY = useRef(0);
  const dinoVelocity = useRef(0);
  const dinoJumping = useRef(false);
  const gameLoop = useRef(null);
  const lastObstacleTimeRef = useRef(Date.now());
  const lastCloudTimeRef = useRef(Date.now());
  const nextObstacleDelayRef = useRef(getRandomInterval());
  const nextCloudDelayRef = useRef(getRandomInterval(1000, 2500));
  const nextObstacleIdRef = useRef(0);
  const nextCloudIdRef = useRef(0);

  useEffect(() => {
    if (gameState === 'playing') {
      setObstacles([]);
      dinoY.current = 0;
      dinoVelocity.current = 0;
      dinoJumping.current = false;
      lastObstacleTimeRef.current = Date.now();
      lastCloudTimeRef.current = Date.now();
      nextObstacleIdRef.current = 0;
      nextObstacleDelayRef.current = getRandomInterval();
      nextCloudDelayRef.current = getRandomInterval(1000, 2500);

      gameLoop.current = setInterval(() => {
        dinoY.current += dinoVelocity.current;
        dinoVelocity.current -= GRAVITY;
        if (dinoY.current < 0) {
          dinoY.current = 0;
          dinoJumping.current = false;
          dinoVelocity.current = 0;
        }

        setObstacles(prev => {
          const updated = prev
            .map(obs => ({ ...obs, x: obs.x - GAME_SPEED }))
            .filter(obs => obs.x + OBSTACLE_WIDTH > 0);

          if (
            Date.now() - lastObstacleTimeRef.current >
            nextObstacleDelayRef.current
          ) {
            updated.push({
              x: SCREEN_WIDTH / 1.1, // Aparece al borde derecho del gameBox
              height: getRandomObstacleHeight(),
              id: nextObstacleIdRef.current++,
            });
            lastObstacleTimeRef.current = Date.now();
            nextObstacleDelayRef.current = getRandomInterval();
          }

          return updated;
        });

        setClouds(prev => {
          const updated = prev
            .map(obs => ({ ...obs, x: obs.x - GAME_SPEED / 3 }))
            .filter(obs => obs.x + OBSTACLE_WIDTH > 0);

          if (
            Date.now() - lastCloudTimeRef.current >
            nextCloudDelayRef.current
          ) {
            console.log('asdentre');
            updated.push({
              x: SCREEN_WIDTH / 1.1, // Aparece al borde derecho del gameBox
              height: getRandomObstacleHeight(),
              id: nextCloudIdRef.current++,
            });
            lastCloudTimeRef.current = Date.now();
            nextCloudDelayRef.current = getRandomInterval(1000, 2500);
          }

          return updated;
        });

        setTick(t => t + 1);
      }, 16);

      return () => clearInterval(gameLoop.current);
    }

    if (gameState === 'gameover') {
      clearInterval(gameLoop.current);
      setTimeout(() => setGameState('ready'), 1000);
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const dinoLeft = 40;
    const dinoRight = dinoLeft + DINO_SIZE;
    const dinoBottom = GROUND_HEIGHT + dinoY.current;
    const dinoTop = dinoBottom + DINO_SIZE;

    obstacles.forEach(obs => {
      const obsLeft = obs.x;
      const obsRight = obs.x + OBSTACLE_WIDTH;
      const obsBottom = GROUND_HEIGHT;
      const obsTop = GROUND_HEIGHT + obs.height;

      const collideX =
        dinoRight - DINO_HITBOX_MARGIN > obsLeft + OBSTACLE_HITBOX_MARGIN &&
        dinoLeft + DINO_HITBOX_MARGIN < obsRight - OBSTACLE_HITBOX_MARGIN;
      const collideY =
        dinoBottom + DINO_HITBOX_MARGIN < obsTop &&
        dinoTop - DINO_HITBOX_MARGIN > obsBottom;

      if (collideX && collideY) setGameState('gameover');
    });
  }, [obstacles, gameState]);

  const handleJump = () => {
    if (gameState === 'ready') {
      setGameState('playing');
    } else if (
      gameState === 'playing' &&
      !dinoJumping.current &&
      dinoY.current <= 0
    ) {
      dinoJumping.current = true;
      dinoVelocity.current = JUMP_VELOCITY;
    }
  };

  console.log('asdCloud', clouds);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.gameBox}
        activeOpacity={1}
        onPress={handleJump}>
        <Text
          style={{ position: 'absolute', top: 10, left: 10, color: '#333' }}>
          {gameState === 'ready'
            ? 'Toca para jugar'
            : gameState === 'playing'
            ? 'Toca para saltar'
            : 'Game Over'}
        </Text>
        <View style={styles.ground} />

        {clouds.map((el, index) => (
          <FontAwesome5
            name="cloud"
            key={el.id}
            style={{
              position: 'absolute',
              left: el.x,
              top: el.height,
            }}
            size={DINO_SIZE}
            color="#ccc"
            solid
          />
        ))}
        <Dino y={dinoY.current} />
        {obstacles.map(obs => (
          <Obstacle key={obs.id} x={obs.x} height={obs.height} />
        ))}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "#fff", // fondo blanco
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBox: {
    width: SCREEN_WIDTH / 1.1,
    height: SCREEN_HEIGHT / 4,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
    borderColor: '#eee',
    borderWidth: 2,
  },
  ground: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: GROUND_HEIGHT,
    backgroundColor: '#ccc',
    bottom: 0,
  },
  dino: {
    position: 'absolute',
    left: 40,
  },
  obstacle: {
    position: 'absolute',
    backgroundColor: 'transparent',

    transform: [{ rotateY: '180deg' }],
  },
});

export default Game;
