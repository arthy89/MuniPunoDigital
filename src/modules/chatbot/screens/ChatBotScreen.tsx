import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { ChatMessage } from '../interfaces/ChatMessage';
import { sendMessage } from '../use-cases/sendMessage';

const SUGGESTED_QUESTIONS = [
  '¿Que puedes hacer?',
  '¿Qué trámites puedo realizar en el municipio?',
  '¿Cual es su numero de la municipalidad?',
  'Hola',
];

const BOT_AVATAR = require('@/assets/images/munipuno.png');
const USER_AVATAR = require('@/assets/images/perfil.png');

export default function ChatBotScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async (text?: string) => {
    const userText = text || input.trim();
    if (!userText) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString() + '_user',
      text: userText,
      sender: 'user',
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    const botMsg = await sendMessage(userText);
    setMessages(prev => [...prev, botMsg]);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const showWelcome = messages.length === 0;

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.messageRow,
        item.sender === 'user' ? styles.rowReverse : null,
      ]}
    >
      <View style={styles.avatarMsg}>
        <Image
          source={item.sender === 'user' ? USER_AVATAR : BOT_AVATAR}
          style={styles.msgAvatar}
        />
      </View>
      <View
        style={[
          styles.bubble,
          item.sender === 'user' ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80} // Ajusta según alto del header
      >
        <View style={styles.container}>

          {/* Solo mostrar bienvenida y sugerencias si no hay mensajes */}
          {showWelcome && (
            <View style={styles.welcomeContainer}>
              <View style={styles.centeredWelcome}>
                <View style={styles.avatarWrapper}>
                  <Image
                    source={BOT_AVATAR}
                    style={styles.avatar}
                    resizeMode="contain"
                  />
                  <View style={styles.onlineDot} />
                </View>
                <Text style={styles.botTitle}>
                  ChatBot de la Municipalidad{'\n'}Provincial de Puno
                </Text>
              </View>

              <View style={styles.suggestedContainer}>
                {SUGGESTED_QUESTIONS.map((q, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.suggestedBubble}
                    onPress={() => handleSend(q)}
                  >
                    <Text style={styles.suggestedText}>{q}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Mensajes */}
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {/* Input */}
          <View style={styles.inputContainer}>
            <View style={styles.inputIcon}>
              <Text style={{ fontSize: 22 }}>🤖</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Escribe tu mensaje..."
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => handleSend()}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => handleSend()}
            >
              <Text style={styles.sendIcon}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e0e0e0',
  },
  backArrow: { fontSize: 22, color: '#0088cc', width: 24 },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 8,
  },
  welcomeContainer: {
  flex: 1,
  justifyContent: 'center',
  paddingHorizontal: 16,
  paddingBottom: 12,
  marginTop: 220,
},
centeredWelcome: {
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1,
},
  avatarWrapper: {
    position: 'relative',
    marginBottom: 8,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#f2f2f2',
  },
  onlineDot: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2ecc40',
    borderWidth: 2,
    borderColor: '#fff',
  },
  botTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center',
    color: '#222',
  },
  suggestedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 30,
    marginBottom: 12,
  },
  suggestedBubble: {
    backgroundColor: '#fff',
    borderColor: '#0088cc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
  suggestedText: {
    color: '#0088cc',
    fontSize: 14,
  },
  messagesContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
    justifyContent: 'flex-end',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  avatarMsg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    marginHorizontal: 4,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 18,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginVertical: 4,
  },
  userBubble: {
    backgroundColor: '#e6f4fa',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#f2f2f2',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userText: { color: '#0088cc', fontSize: 15 },
  botText: { color: '#222', fontSize: 15 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 0.5,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f4fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f7f7f7',
    borderRadius: 20,
    marginRight: 6,
    color: '#222',
  },
  sendButton: {
    backgroundColor: '#0088cc',
    borderRadius: 20,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendIcon: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});