import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const TasksContext = createContext(null);
const STORAGE_KEY = '@campus-tasks';

/**
 * Recebe a lista atual e a ação; devolve sempre um array novo.
 */
function tasksReducer(state, action) {
  switch (action.type) {
    case 'ADD':
      return [
        {
          ...action.payload,
          id: Date.now().toString(),
          done: false,
          createdAt: new Date().toISOString(),
        },
        ...state,
      ];
    case 'UPDATE':
      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, ...action.payload.data }
          : item
      );
    case 'DELETE':
      return state.filter((item) => item.id !== action.payload);
    case 'SET':
      return action.payload;
    default:
      return state;
  }
}

/**
 * Guarda as tarefas e oferece as ações para todas as telas.
 */
export function TasksContextProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [isLoaded, setIsLoaded] = useState(false);

  /**
   * Adiciona uma tarefa nova à lista.
   */
  const addTask = (data) => dispatch({ type: 'ADD', payload: data });

  /**
   * Atualiza uma tarefa existente pelo id.
   */
  const updateTask = (id, data) =>
    dispatch({ type: 'UPDATE', payload: { id, data } });

  /**
   * Remove uma tarefa pelo id.
   */
  const deleteTask = (id) => dispatch({ type: 'DELETE', payload: id });

  /**
   * Alterna o status de conclusão da tarefa.
   */
  const toggleDone = (id) => {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    dispatch({
      type: 'UPDATE',
      payload: { id, data: { done: !task.done } },
    });
  };

  useEffect(() => {
    async function load() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          dispatch({ type: 'SET', payload: JSON.parse(json) });
        }
      } catch (error) {
        console.log('Erro ao carregar tarefas', error);
      } finally {
        setIsLoaded(true);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleDone,
    isLoaded,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

/**
 * Atalho para usar o contexto de tarefas em qualquer tela.
 */
export function useTasks() {
  const ctx = useContext(TasksContext);
  if (!ctx) {
    throw new Error('Faltou o TasksContextProvider');
  }
  return ctx;
}
