import type { AppLanguage } from '../types/recipe'

const translations: Record<string, Record<AppLanguage, string>> = {
  // App
  'app.title': { en: 'Even Kitchen', it: 'Even Kitchen', es: 'Even Kitchen', fr: 'Even Kitchen', de: 'Even Kitchen', pt: 'Even Kitchen', ja: 'Even Kitchen', zh: 'Even Kitchen', ko: 'Even Kitchen', ru: 'Even Kitchen' },
  'app.subtitle': { en: 'What are we cooking today?', it: 'Cosa cuciniamo oggi?', es: 'Que cocinamos hoy?', fr: 'Que cuisinons-nous aujourd\'hui?', de: 'Was kochen wir heute?', pt: 'O que cozinhamos hoje?', ja: '今日は何を作りますか?', zh: '今天做什么菜?', ko: '오늘 뭘 요리할까요?', ru: 'Что приготовим сегодня?' },

  // Recipe Detail
  'recipe.startCooking': { en: 'Start Cooking', it: 'Inizia a Cucinare', es: 'Empezar a Cocinar', fr: 'Commencer', de: 'Kochen starten', pt: 'Comecar a Cozinhar', ja: '調理開始', zh: '开始烹饪', ko: '요리 시작', ru: 'Начать готовку' },
  'recipe.edit': { en: 'Edit', it: 'Modifica', es: 'Editar', fr: 'Modifier', de: 'Bearbeiten', pt: 'Editar', ja: '編集', zh: '编辑', ko: '편집', ru: 'Редактировать' },
  'recipe.delete': { en: 'Delete Recipe', it: 'Elimina Ricetta', es: 'Eliminar Receta', fr: 'Supprimer', de: 'Rezept loschen', pt: 'Apagar Receita', ja: 'レシピ削除', zh: '删除食谱', ko: '레시피 삭제', ru: 'Удалить рецепт' },
  'recipe.confirmDelete': { en: 'Tap Again to Confirm Delete', it: 'Tocca di nuovo per confermare', es: 'Toca de nuevo para confirmar', fr: 'Appuyez pour confirmer', de: 'Erneut tippen zum Bestatigen', pt: 'Toque novamente para confirmar', ja: 'もう一度タップして確認', zh: '再次点击确认删除', ko: '다시 탭하여 확인', ru: 'Нажмите ещё раз для подтверждения' },
  'recipe.archive': { en: 'Archive Recipe', it: 'Archivia Ricetta', es: 'Archivar Receta', fr: 'Archiver', de: 'Archivieren', pt: 'Arquivar Receita', ja: 'レシピをアーカイブ', zh: '归档食谱', ko: '레시피 보관', ru: 'Архивировать рецепт' },
  'recipe.unarchive': { en: 'Unarchive Recipe', it: 'Ripristina Ricetta', es: 'Desarchivar', fr: 'Desarchiver', de: 'Wiederherstellen', pt: 'Desarquivar', ja: 'アーカイブ解除', zh: '取消归档', ko: '보관 해제', ru: 'Разархивировать рецепт' },
  'recipe.ingredients': { en: 'Ingredients', it: 'Ingredienti', es: 'Ingredientes', fr: 'Ingredients', de: 'Zutaten', pt: 'Ingredientes', ja: '材料', zh: '食材', ko: '재료', ru: 'Ингредиенты' },
  'recipe.steps': { en: 'Steps', it: 'Passaggi', es: 'Pasos', fr: 'Etapes', de: 'Schritte', pt: 'Passos', ja: 'ステップ', zh: '步骤', ko: '단계', ru: 'Шаги' },
  'recipe.servings': { en: 'servings', it: 'porzioni', es: 'porciones', fr: 'portions', de: 'Portionen', pt: 'porcoes', ja: '人前', zh: '份', ko: '인분', ru: 'порций' },
  'recipe.notFound': { en: 'Recipe not found.', it: 'Ricetta non trovata.', es: 'Receta no encontrada.', fr: 'Recette introuvable.', de: 'Rezept nicht gefunden.', pt: 'Receita nao encontrada.', ja: 'レシピが見つかりません。', zh: '未找到食谱。', ko: '레시피를 찾을 수 없습니다.', ru: 'Рецепт не найден.' },

  // Cooking
  'cooking.step': { en: 'Step', it: 'Passaggio', es: 'Paso', fr: 'Etape', de: 'Schritt', pt: 'Passo', ja: 'ステップ', zh: '步骤', ko: '단계', ru: 'Шаг' },
  'cooking.of': { en: 'of', it: 'di', es: 'de', fr: 'de', de: 'von', pt: 'de', ja: '/', zh: '/', ko: '/', ru: 'из' },
  'cooking.exit': { en: 'Exit', it: 'Esci', es: 'Salir', fr: 'Quitter', de: 'Beenden', pt: 'Sair', ja: '終了', zh: '退出', ko: '나가기', ru: 'Выход' },
  'cooking.startTimer': { en: 'Start Timer', it: 'Avvia Timer', es: 'Iniciar Temporizador', fr: 'Demarrer', de: 'Timer starten', pt: 'Iniciar Timer', ja: 'タイマー開始', zh: '开始计时', ko: '타이머 시작', ru: 'Запустить таймер' },
  'cooking.pause': { en: 'Pause', it: 'Pausa', es: 'Pausar', fr: 'Pause', de: 'Pause', pt: 'Pausar', ja: '一時停止', zh: '暂停', ko: '일시정지', ru: 'Пауза' },
  'cooking.resume': { en: 'Resume', it: 'Riprendi', es: 'Reanudar', fr: 'Reprendre', de: 'Fortsetzen', pt: 'Retomar', ja: '再開', zh: '继续', ko: '계속', ru: 'Продолжить' },
  'cooking.reset': { en: 'Reset', it: 'Reset', es: 'Reiniciar', fr: 'Reinitialiser', de: 'Zurucksetzen', pt: 'Reiniciar', ja: 'リセット', zh: '重置', ko: '리셋', ru: 'Сброс' },

  // Completion
  'complete.title': { en: 'Bon Appetit!', it: 'Buon Appetito!', es: 'Buen Provecho!', fr: 'Bon Appetit!', de: 'Guten Appetit!', pt: 'Bom Apetite!', ja: 'いただきます!', zh: '开动吧!', ko: '맛있게 드세요!', ru: 'Приятного аппетита!' },
  'complete.ready': { en: 'is ready to serve.', it: 'e pronto da servire.', es: 'esta listo para servir.', fr: 'est pret a servir.', de: 'ist servierfertig.', pt: 'esta pronto para servir.', ja: '出来上がりました。', zh: '可以上菜了。', ko: '준비되었습니다.', ru: 'готово к подаче.' },
  'complete.cookAgain': { en: 'Cook Again', it: 'Cucina Ancora', es: 'Cocinar de Nuevo', fr: 'Recuisiner', de: 'Nochmal kochen', pt: 'Cozinhar de Novo', ja: 'もう一度作る', zh: '再做一次', ko: '다시 요리', ru: 'Готовить снова' },
  'complete.backToLibrary': { en: 'Back to Library', it: 'Torna alla Libreria', es: 'Volver a la Biblioteca', fr: 'Retour', de: 'Zur Bibliothek', pt: 'Voltar', ja: 'ライブラリへ', zh: '返回菜单', ko: '라이브러리로', ru: 'Назад в библиотеку' },

  // Library
  'library.new': { en: '+ New', it: '+ Nuova', es: '+ Nueva', fr: '+ Nouveau', de: '+ Neu', pt: '+ Nova', ja: '+ 新規', zh: '+ 新建', ko: '+ 새로', ru: '+ Новый' },
  'library.noRecipes': { en: 'No recipes in this category yet.', it: 'Nessuna ricetta in questa categoria.', es: 'No hay recetas en esta categoria.', fr: 'Pas de recettes dans cette categorie.', de: 'Noch keine Rezepte in dieser Kategorie.', pt: 'Nenhuma receita nesta categoria.', ja: 'このカテゴリにレシピはまだありません。', zh: '此类别暂无食谱。', ko: '이 카테고리에 레시피가 없습니다.', ru: 'В этой категории пока нет рецептов.' },
  'library.tab.library': { en: 'Library', it: 'Libreria', es: 'Biblioteca', fr: 'Bibliotheque', de: 'Bibliothek', pt: 'Biblioteca', ja: 'ライブラリ', zh: '菜谱库', ko: '라이브러리', ru: 'Библиотека' },
  'library.tab.aiImport': { en: 'AI Import', it: 'Importa con AI', es: 'Importar con IA', fr: 'Import IA', de: 'KI Import', pt: 'Importar com IA', ja: 'AI取込', zh: 'AI导入', ko: 'AI 가져오기', ru: 'ИИ Импорт' },

  // Settings
  'settings.title': { en: 'Settings', it: 'Impostazioni', es: 'Ajustes', fr: 'Parametres', de: 'Einstellungen', pt: 'Configuracoes', ja: '設定', zh: '设置', ko: '설정', ru: 'Настройки' },
  'settings.language': { en: 'Language', it: 'Lingua', es: 'Idioma', fr: 'Langue', de: 'Sprache', pt: 'Idioma', ja: '言語', zh: '语言', ko: '언어', ru: 'Язык' },
  'settings.aiProvider': { en: 'AI Provider', it: 'Provider AI', es: 'Proveedor IA', fr: 'Fournisseur IA', de: 'KI-Anbieter', pt: 'Provedor IA', ja: 'AIプロバイダー', zh: 'AI提供商', ko: 'AI 제공자', ru: 'ИИ Провайдер' },
  'settings.model': { en: 'Model', it: 'Modello', es: 'Modelo', fr: 'Modele', de: 'Modell', pt: 'Modelo', ja: 'モデル', zh: '模型', ko: '모델', ru: 'Модель' },
  'settings.apiKey': { en: 'API Key', it: 'Chiave API', es: 'Clave API', fr: 'Cle API', de: 'API-Schlussel', pt: 'Chave API', ja: 'APIキー', zh: 'API密钥', ko: 'API 키', ru: 'API Ключ' },
  'settings.save': { en: 'Save', it: 'Salva', es: 'Guardar', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar', ja: '保存', zh: '保存', ko: '저장', ru: 'Сохранить' },
  'settings.yourKitchen': { en: 'Your Kitchen', it: 'La Tua Cucina', es: 'Tu Cocina', fr: 'Votre Cuisine', de: 'Deine Kuche', pt: 'Sua Cozinha', ja: 'あなたのキッチン', zh: '你的厨房', ko: '내 주방', ru: 'Ваша кухня' },
  'settings.recipes': { en: 'Recipes', it: 'Ricette', es: 'Recetas', fr: 'Recettes', de: 'Rezepte', pt: 'Receitas', ja: 'レシピ', zh: '食谱', ko: '레시피', ru: 'Рецепты' },
  'settings.categories': { en: 'Categories', it: 'Categorie', es: 'Categorias', fr: 'Categories', de: 'Kategorien', pt: 'Categorias', ja: 'カテゴリ', zh: '分类', ko: '카테고리', ru: 'Категории' },
  'settings.dataManagement': { en: 'Data Management', it: 'Gestione Dati', es: 'Gestion de Datos', fr: 'Gestion des donnees', de: 'Datenverwaltung', pt: 'Gestao de Dados', ja: 'データ管理', zh: '数据管理', ko: '데이터 관리', ru: 'Управление данными' },
  'settings.export': { en: 'Export All Recipes (JSON)', it: 'Esporta Tutte le Ricette (JSON)', es: 'Exportar Todas las Recetas (JSON)', fr: 'Exporter (JSON)', de: 'Alle Rezepte exportieren (JSON)', pt: 'Exportar Todas as Receitas (JSON)', ja: '全レシピをエクスポート (JSON)', zh: '导出所有食谱 (JSON)', ko: '모든 레시피 내보내기 (JSON)', ru: 'Экспорт всех рецептов (JSON)' },
  'settings.import': { en: 'Import Recipes (JSON)', it: 'Importa Ricette (JSON)', es: 'Importar Recetas (JSON)', fr: 'Importer (JSON)', de: 'Rezepte importieren (JSON)', pt: 'Importar Receitas (JSON)', ja: 'レシピをインポート (JSON)', zh: '导入食谱 (JSON)', ko: '레시피 가져오기 (JSON)', ru: 'Импорт рецептов (JSON)' },
  'settings.reset': { en: 'Reset to Defaults', it: 'Ripristina Predefiniti', es: 'Restablecer', fr: 'Reinitialiser', de: 'Zurucksetzen', pt: 'Restaurar Padrao', ja: 'デフォルトに戻す', zh: '恢复默认', ko: '기본값으로 리셋', ru: 'Сбросить по умолчанию' },
  'settings.confirmReset': { en: 'Confirm Reset -- Tap Again', it: 'Conferma -- Tocca Ancora', es: 'Confirmar -- Toca de Nuevo', fr: 'Confirmer -- Appuyez', de: 'Bestatigen -- Erneut tippen', pt: 'Confirmar -- Toque Novamente', ja: '確認 -- もう一度タップ', zh: '確认 -- 再次点击', ko: '확인 -- 다시 탭', ru: 'Подтвердить -- Нажмите ещё раз' },
  'settings.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ru: 'Отмена' },
  'settings.about': { en: 'About', it: 'Info', es: 'Acerca de', fr: 'A propos', de: 'Info', pt: 'Sobre', ja: '情報', zh: '关于', ko: '정보', ru: 'О приложении' },
  'settings.aboutText': { en: 'Even Kitchen v1.0 -- A guided cooking companion for your recipes.', it: 'Even Kitchen v1.0 -- Un compagno di cucina guidato per le tue ricette.', es: 'Even Kitchen v1.0 -- Un companero de cocina guiado.', fr: 'Even Kitchen v1.0 -- Un compagnon de cuisine guide.', de: 'Even Kitchen v1.0 -- Ein gefuhrter Kochbegleiter.', pt: 'Even Kitchen v1.0 -- Um companheiro de cozinha guiado.', ja: 'Even Kitchen v1.0 -- ガイド付きクッキングコンパニオン', zh: 'Even Kitchen v1.0 -- 你的烹饪伴侣', ko: 'Even Kitchen v1.0 -- 가이드 요리 도우미', ru: 'Even Kitchen v1.0 -- Кулинарный помощник для ваших рецептов.' },
  'settings.localData': { en: 'Data is stored locally in your browser.', it: 'I dati sono salvati localmente nel browser.', es: 'Los datos se almacenan localmente en el navegador.', fr: 'Donnees stockees localement.', de: 'Daten werden lokal gespeichert.', pt: 'Dados armazenados localmente.', ja: 'データはブラウザにローカル保存されます。', zh: '数据存储在浏览器本地。', ko: '데이터는 브라우저에 로컬 저장됩니다.', ru: 'Данные хранятся локально в вашем браузере.' },

  // Recipe Form
  'form.newRecipe': { en: 'New Recipe', it: 'Nuova Ricetta', es: 'Nueva Receta', fr: 'Nouvelle Recette', de: 'Neues Rezept', pt: 'Nova Receita', ja: '新しいレシピ', zh: '新建食谱', ko: '새 레시피', ru: 'Новый рецепт' },
  'form.editRecipe': { en: 'Edit Recipe', it: 'Modifica Ricetta', es: 'Editar Receta', fr: 'Modifier la Recette', de: 'Rezept bearbeiten', pt: 'Editar Receita', ja: 'レシピ編集', zh: '编辑食谱', ko: '레시피 편집', ru: 'Редактировать рецепт' },
  'form.save': { en: 'Save', it: 'Salva', es: 'Guardar', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar', ja: '保存', zh: '保存', ko: '저장', ru: 'Сохранить' },
  'form.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ru: 'Отмена' },

  // AI Import
  'ai.extractTitle': { en: 'Extract Recipe from URL', it: 'Estrai Ricetta da URL', es: 'Extraer Receta de URL', fr: 'Extraire depuis URL', de: 'Rezept aus URL extrahieren', pt: 'Extrair Receita do URL', ja: 'URLからレシピを抽出', zh: '从URL提取食谱', ko: 'URL에서 레시피 추출', ru: 'Извлечь рецепт из URL' },
  'ai.paste': { en: 'Paste', it: 'Incolla', es: 'Pegar', fr: 'Coller', de: 'Einfugen', pt: 'Colar', ja: '貼り付け', zh: '粘贴', ko: '붙여넣기', ru: 'Вставить' },
  'ai.extract': { en: 'Extract Recipe', it: 'Estrai Ricetta', es: 'Extraer Receta', fr: 'Extraire', de: 'Extrahieren', pt: 'Extrair', ja: '抽出', zh: '提取', ko: '추출', ru: 'Извлечь рецепт' },
  'ai.extracting': { en: 'Extracting...', it: 'Estrazione...', es: 'Extrayendo...', fr: 'Extraction...', de: 'Extrahiere...', pt: 'Extraindo...', ja: '抽出中...', zh: '提取中...', ko: '추출 중...', ru: 'Извлечение...' },
  'ai.analyzing': { en: 'Analyzing recipe...', it: 'Analizzando ricetta...', es: 'Analizando receta...', fr: 'Analyse en cours...', de: 'Analysiere Rezept...', pt: 'Analisando receita...', ja: 'レシピを分析中...', zh: '分析食谱中...', ko: '레시피 분석 중...', ru: 'Анализ рецепта...' },
  'ai.saveToLibrary': { en: 'Save to Library', it: 'Salva in Libreria', es: 'Guardar en Biblioteca', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar na Biblioteca', ja: 'ライブラリに保存', zh: '保存到菜谱库', ko: '라이브러리에 저장', ru: 'Сохранить в библиотеку' },
  'ai.saved': { en: 'Saved to library!', it: 'Salvato in libreria!', es: 'Guardado en biblioteca!', fr: 'Sauvegarde!', de: 'Gespeichert!', pt: 'Salvo na biblioteca!', ja: 'ライブラリに保存しました!', zh: '已保存到菜谱库!', ko: '라이브러리에 저장됨!', ru: 'Сохранено в библиотеку!' },
  'ai.clear': { en: 'Clear', it: 'Cancella', es: 'Limpiar', fr: 'Effacer', de: 'Loschen', pt: 'Limpar', ja: 'クリア', zh: '清除', ko: '지우기', ru: 'Очистить' },

  // Glass Display
  'glass.timer': { en: 'Timer', it: 'Timer', es: 'Temporizador', fr: 'Minuteur', de: 'Timer', pt: 'Temporizador', ja: 'タイマー', zh: '计时器', ko: '타이머', ru: 'Таймер' },
  'glass.scroll': { en: 'Scroll', it: 'Scorri', es: 'Desplazar', fr: 'Defiler', de: 'Scrollen', pt: 'Rolar', ja: 'スクロール', zh: '滚动', ko: '스크롤', ru: 'Прокрутка' },
  'glass.steps': { en: 'Steps', it: 'Passi', es: 'Pasos', fr: 'Etapes', de: 'Schritte', pt: 'Passos', ja: 'ステップ', zh: '步骤', ko: '단계', ru: 'Шаги' },
  'glass.finish': { en: 'Finish', it: 'Fine', es: 'Finalizar', fr: 'Terminer', de: 'Fertig', pt: 'Finalizar', ja: '完了', zh: '完成', ko: '완료', ru: 'Завершить' },
  'glass.recipes': { en: 'Recipes', it: 'Ricette', es: 'Recetas', fr: 'Recettes', de: 'Rezepte', pt: 'Receitas', ja: 'レシピ', zh: '食谱', ko: '레시피', ru: 'Рецепты' },
  'glass.servings': { en: 'servings prepared with care.', it: 'porzioni preparate con cura.', es: 'porciones preparadas con cuidado.', fr: 'portions preparees avec soin.', de: 'Portionen mit Sorgfalt zubereitet.', pt: 'porcoes preparadas com cuidado.', ja: '人前、心を込めて調理しました。', zh: '份，精心烹制。', ko: '인분, 정성껏 준비했습니다.', ru: 'порций приготовлено с заботой.' },
}

/** Get language name from code */
export function getLanguageName(lang: AppLanguage): string {
  return translations['settings.language']?.[lang] ?? lang
}

/** Get full language name for AI prompt */
export function getLanguageFullName(lang: AppLanguage): string {
  const names: Record<AppLanguage, string> = {
    en: 'English', it: 'Italian', es: 'Spanish', fr: 'French',
    de: 'German', pt: 'Portuguese', ja: 'Japanese', zh: 'Chinese', ko: 'Korean',
    ru: 'Russian',
  }
  return names[lang]
}

export function t(key: string, lang: AppLanguage): string {
  return translations[key]?.[lang] ?? translations[key]?.['en'] ?? key
}
