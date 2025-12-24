import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '@/store/languageStore';
import { Language } from '@/i18n/translations';

const languages: { code: Language; label: string; flag: string }[] = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();

  const currentLanguage = languages.find((l) => l.code === language);

  const handleSelect = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className="flex-row items-center"
      >
        <Ionicons name="language-outline" size={22} color="#374151" />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setIsOpen(false)}
        >
          <Pressable
            className="bg-white rounded-2xl w-64 overflow-hidden"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="p-4 border-b border-gray-100">
              <Text className="text-lg font-semibold text-gray-800 text-center">
                {language === 'ko' ? '언어 선택' : language === 'ja' ? '言語選択' : 'Select Language'}
              </Text>
            </View>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleSelect(lang.code)}
                className={`flex-row items-center justify-between p-4 ${
                  language === lang.code ? 'bg-blue-50' : ''
                }`}
              >
                <View className="flex-row items-center gap-3">
                  <Text className="text-xl">{lang.flag}</Text>
                  <Text
                    className={`text-base ${
                      language === lang.code
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {lang.label}
                  </Text>
                </View>
                {language === lang.code && (
                  <Ionicons name="checkmark" size={20} color="#2563eb" />
                )}
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
