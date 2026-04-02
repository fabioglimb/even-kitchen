import type { AppLanguage } from '../types/recipe'

const translations: Record<string, Record<AppLanguage, string>> = {
  // App
  'app.title': { en: 'ER Kitchen', it: 'ER Kitchen', es: 'ER Kitchen', fr: 'ER Kitchen', de: 'ER Kitchen', pt: 'ER Kitchen', ja: 'ER Kitchen', zh: 'ER Kitchen', ko: 'ER Kitchen', ru: 'ER Kitchen' },
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
  'settings.aboutText': { en: 'ER Kitchen v1.0 -- A guided cooking companion for your recipes.', it: 'ER Kitchen v1.0 -- Un compagno di cucina guidato per le tue ricette.', es: 'ER Kitchen v1.0 -- Un companero de cocina guiado.', fr: 'ER Kitchen v1.0 -- Un compagnon de cuisine guide.', de: 'ER Kitchen v1.0 -- Ein gefuhrter Kochbegleiter.', pt: 'ER Kitchen v1.0 -- Um companheiro de cozinha guiado.', ja: 'ER Kitchen v1.0 -- ガイド付きクッキングコンパニオン', zh: 'ER Kitchen v1.0 -- 你的烹饪伴侣', ko: 'ER Kitchen v1.0 -- 가이드 요리 도우미', ru: 'ER Kitchen v1.0 -- Кулинарный помощник для ваших рецептов.' },
  'settings.localData': { en: 'Data is stored locally in your browser.', it: 'I dati sono salvati localmente nel browser.', es: 'Los datos se almacenan localmente en el navegador.', fr: 'Donnees stockees localement.', de: 'Daten werden lokal gespeichert.', pt: 'Dados armazenados localmente.', ja: 'データはブラウザにローカル保存されます。', zh: '数据存储在浏览器本地。', ko: '데이터는 브라우저에 로컬 저장됩니다.', ru: 'Данные хранятся локально в вашем браузере.' },

  // Recipe Form
  'form.newRecipe': { en: 'New Recipe', it: 'Nuova Ricetta', es: 'Nueva Receta', fr: 'Nouvelle Recette', de: 'Neues Rezept', pt: 'Nova Receita', ja: '新しいレシピ', zh: '新建食谱', ko: '새 레시피', ru: 'Новый рецепт' },
  'form.editRecipe': { en: 'Edit Recipe', it: 'Modifica Ricetta', es: 'Editar Receta', fr: 'Modifier la Recette', de: 'Rezept bearbeiten', pt: 'Editar Receita', ja: 'レシピ編集', zh: '编辑食谱', ko: '레시피 편집', ru: 'Редактировать рецепт' },
  'form.save': { en: 'Save', it: 'Salva', es: 'Guardar', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar', ja: '保存', zh: '保存', ko: '저장', ru: 'Сохранить' },
  'form.cancel': { en: 'Cancel', it: 'Annulla', es: 'Cancelar', fr: 'Annuler', de: 'Abbrechen', pt: 'Cancelar', ja: 'キャンセル', zh: '取消', ko: '취소', ru: 'Отмена' },
  'form.recipe': { en: 'Recipe', it: 'Ricetta', es: 'Receta', fr: 'Recette', de: 'Rezept', pt: 'Receita', ja: 'レシピ', zh: '食谱', ko: '레시피', ru: 'Рецепт' },
  'form.name': { en: 'Name', it: 'Nome', es: 'Nombre', fr: 'Nom', de: 'Name', pt: 'Nome', ja: '名前', zh: '名称', ko: '이름', ru: 'Название' },
  'form.recipeName': { en: 'Recipe title', it: 'Titolo ricetta', es: 'Titulo de receta', fr: 'Titre de la recette', de: 'Rezeptname', pt: 'Titulo da receita', ja: 'レシピ名', zh: '食谱标题', ko: '레시피 제목', ru: 'Название рецепта' },
  'form.description': { en: 'Description', it: 'Descrizione', es: 'Descripcion', fr: 'Description', de: 'Beschreibung', pt: 'Descricao', ja: '説明', zh: '描述', ko: '설명', ru: 'Описание' },
  'form.descriptionPlaceholder': { en: 'Subtitle / description', it: 'Sottotitolo / descrizione', es: 'Subtitulo / descripcion', fr: 'Sous-titre / description', de: 'Untertitel / Beschreibung', pt: 'Subtitulo / descricao', ja: 'サブタイトル / 説明', zh: '副标题 / 描述', ko: '부제 / 설명', ru: 'Подзаголовок / описание' },
  'form.category': { en: 'Category', it: 'Categoria', es: 'Categoria', fr: 'Categorie', de: 'Kategorie', pt: 'Categoria', ja: 'カテゴリ', zh: '分类', ko: '카테고리', ru: 'Категория' },
  'form.categoryPlaceholder': { en: 'e.g. Pasta', it: 'es. Pasta', es: 'ej. Pasta', fr: 'ex. Pates', de: 'z.B. Pasta', pt: 'ex. Massa', ja: '例：パスタ', zh: '例如：意面', ko: '예: 파스타', ru: 'напр. Паста' },
  'form.difficulty': { en: 'Difficulty', it: 'Difficolta', es: 'Dificultad', fr: 'Difficulte', de: 'Schwierigkeit', pt: 'Dificuldade', ja: '難易度', zh: '难度', ko: '난이도', ru: 'Сложность' },
  'form.easy': { en: 'Easy', it: 'Facile', es: 'Facil', fr: 'Facile', de: 'Einfach', pt: 'Facil', ja: '簡単', zh: '简单', ko: '쉬움', ru: 'Легко' },
  'form.medium': { en: 'Medium', it: 'Medio', es: 'Medio', fr: 'Moyen', de: 'Mittel', pt: 'Medio', ja: '普通', zh: '中等', ko: '보통', ru: 'Средне' },
  'form.hard': { en: 'Hard', it: 'Difficile', es: 'Dificil', fr: 'Difficile', de: 'Schwer', pt: 'Dificil', ja: '難しい', zh: '困难', ko: '어려움', ru: 'Трудно' },
  'form.prepMin': { en: 'Prep (min)', it: 'Prep (min)', es: 'Prep (min)', fr: 'Prep (min)', de: 'Vorb. (Min)', pt: 'Prep (min)', ja: '下準備(分)', zh: '准备(分)', ko: '준비(분)', ru: 'Подг. (мин)' },
  'form.cookMin': { en: 'Cook (min)', it: 'Cottura (min)', es: 'Coccion (min)', fr: 'Cuisson (min)', de: 'Kochen (Min)', pt: 'Cozimento (min)', ja: '調理(分)', zh: '烹饪(分)', ko: '조리(분)', ru: 'Готовка (мин)' },
  'form.servings': { en: 'Servings', it: 'Porzioni', es: 'Porciones', fr: 'Portions', de: 'Portionen', pt: 'Porcoes', ja: '人前', zh: '份量', ko: '인분', ru: 'Порций' },
  'form.appearance': { en: 'Appearance', it: 'Aspetto', es: 'Apariencia', fr: 'Apparence', de: 'Darstellung', pt: 'Aparencia', ja: '外観', zh: '外观', ko: '외관', ru: 'Внешний вид' },
  'form.emoji': { en: 'Emoji', it: 'Emoji', es: 'Emoji', fr: 'Emoji', de: 'Emoji', pt: 'Emoji', ja: '絵文字', zh: '表情', ko: '이모지', ru: 'Эмодзи' },
  'form.accentColor': { en: 'Accent Color', it: 'Colore Accento', es: 'Color de Acento', fr: 'Couleur d\'Accent', de: 'Akzentfarbe', pt: 'Cor de Destaque', ja: 'アクセントカラー', zh: '强调色', ko: '강조 색상', ru: 'Акцентный цвет' },
  'form.ingredients': { en: 'Ingredients', it: 'Ingredienti', es: 'Ingredientes', fr: 'Ingredients', de: 'Zutaten', pt: 'Ingredientes', ja: '材料', zh: '食材', ko: '재료', ru: 'Ингредиенты' },
  'form.ingredient': { en: 'Ingredient', it: 'Ingrediente', es: 'Ingrediente', fr: 'Ingredient', de: 'Zutat', pt: 'Ingrediente', ja: '材料', zh: '食材', ko: '재료', ru: 'Ингредиент' },
  'form.qty': { en: 'Qty', it: 'Qtà', es: 'Cant', fr: 'Qté', de: 'Menge', pt: 'Qtd', ja: '量', zh: '数量', ko: '양', ru: 'Кол-во' },
  'form.unit': { en: 'Unit', it: 'Unità', es: 'Unidad', fr: 'Unité', de: 'Einheit', pt: 'Unidade', ja: '単位', zh: '单位', ko: '단위', ru: 'Ед.' },
  'form.addIngredient': { en: '+ Add Ingredient', it: '+ Aggiungi Ingrediente', es: '+ Anadir Ingrediente', fr: '+ Ajouter un Ingredient', de: '+ Zutat hinzufugen', pt: '+ Adicionar Ingrediente', ja: '+ 材料を追加', zh: '+ 添加食材', ko: '+ 재료 추가', ru: '+ Добавить ингредиент' },
  'form.steps': { en: 'Steps', it: 'Passaggi', es: 'Pasos', fr: 'Etapes', de: 'Schritte', pt: 'Passos', ja: 'ステップ', zh: '步骤', ko: '단계', ru: 'Шаги' },
  'form.step': { en: 'Step', it: 'Passaggio', es: 'Paso', fr: 'Etape', de: 'Schritt', pt: 'Passo', ja: 'ステップ', zh: '步骤', ko: '단계', ru: 'Шаг' },
  'form.title': { en: 'Title', it: 'Titolo', es: 'Titulo', fr: 'Titre', de: 'Titel', pt: 'Titulo', ja: 'タイトル', zh: '标题', ko: '제목', ru: 'Заголовок' },
  'form.stepTitle': { en: 'Step title', it: 'Titolo del passaggio', es: 'Titulo del paso', fr: 'Titre de l\'etape', de: 'Schritt-Titel', pt: 'Titulo do passo', ja: 'ステップのタイトル', zh: '步骤标题', ko: '단계 제목', ru: 'Заголовок шага' },
  'form.instructions': { en: 'Instructions', it: 'Istruzioni', es: 'Instrucciones', fr: 'Instructions', de: 'Anleitung', pt: 'Instrucoes', ja: '手順', zh: '说明', ko: '설명', ru: 'Инструкции' },
  'form.timerSeconds': { en: 'Timer (seconds, optional)', it: 'Timer (secondi, opzionale)', es: 'Temporizador (segundos, opcional)', fr: 'Minuteur (secondes, optionnel)', de: 'Timer (Sekunden, optional)', pt: 'Timer (segundos, opcional)', ja: 'タイマー（秒、任意）', zh: '计时器（秒，可选）', ko: '타이머 (초, 선택)', ru: 'Таймер (секунды, необязательно)' },
  'form.addStep': { en: '+ Add Step', it: '+ Aggiungi Passaggio', es: '+ Anadir Paso', fr: '+ Ajouter une Etape', de: '+ Schritt hinzufugen', pt: '+ Adicionar Passo', ja: '+ ステップ追加', zh: '+ 添加步骤', ko: '+ 단계 추가', ru: '+ Добавить шаг' },
  'form.saveChanges': { en: 'Save Changes', it: 'Salva Modifiche', es: 'Guardar Cambios', fr: 'Enregistrer', de: 'Anderungen speichern', pt: 'Salvar Alteracoes', ja: '変更を保存', zh: '保存更改', ko: '변경 저장', ru: 'Сохранить изменения' },
  'form.createRecipe': { en: 'Create Recipe', it: 'Crea Ricetta', es: 'Crear Receta', fr: 'Creer la Recette', de: 'Rezept erstellen', pt: 'Criar Receita', ja: 'レシピ作成', zh: '创建食谱', ko: '레시피 만들기', ru: 'Создать рецепт' },

  // Settings - additional
  'settings.provider': { en: 'Provider', it: 'Provider', es: 'Proveedor', fr: 'Fournisseur', de: 'Anbieter', pt: 'Provedor', ja: 'プロバイダー', zh: '提供商', ko: '제공자', ru: 'Провайдер' },
  'settings.storedLocally': { en: 'Stored locally, sent directly to', it: 'Salvato localmente, inviato direttamente a', es: 'Almacenado localmente, enviado directamente a', fr: 'Stocke localement, envoye directement a', de: 'Lokal gespeichert, direkt gesendet an', pt: 'Armazenado localmente, enviado diretamente para', ja: 'ローカルに保存、直接送信先:', zh: '本地存储，直接发送至', ko: '로컬 저장, 직접 전송 대상:', ru: 'Хранится локально, отправляется напрямую в' },
  'settings.show': { en: 'Show', it: 'Mostra', es: 'Mostrar', fr: 'Afficher', de: 'Anzeigen', pt: 'Mostrar', ja: '表示', zh: '显示', ko: '보기', ru: 'Показать' },
  'settings.hide': { en: 'Hide', it: 'Nascondi', es: 'Ocultar', fr: 'Masquer', de: 'Verbergen', pt: 'Ocultar', ja: '非表示', zh: '隐藏', ko: '숨기기', ru: 'Скрыть' },
  'settings.data': { en: 'Data', it: 'Dati', es: 'Datos', fr: 'Donnees', de: 'Daten', pt: 'Dados', ja: 'データ', zh: '数据', ko: '데이터', ru: 'Данные' },
  'settings.exportRecipes': { en: 'Export Recipes', it: 'Esporta Ricette', es: 'Exportar Recetas', fr: 'Exporter les Recettes', de: 'Rezepte exportieren', pt: 'Exportar Receitas', ja: 'レシピをエクスポート', zh: '导出食谱', ko: '레시피 내보내기', ru: 'Экспорт рецептов' },
  'settings.recipesInCollection': { en: 'recipe(s) in your collection', it: 'ricetta/e nella tua collezione', es: 'receta(s) en tu coleccion', fr: 'recette(s) dans votre collection', de: 'Rezept(e) in Ihrer Sammlung', pt: 'receita(s) na sua colecao', ja: '件のレシピ', zh: '个食谱', ko: '개 레시피', ru: 'рецепт(ов) в коллекции' },
  'settings.exportBtn': { en: 'Export', it: 'Esporta', es: 'Exportar', fr: 'Exporter', de: 'Exportieren', pt: 'Exportar', ja: 'エクスポート', zh: '导出', ko: '내보내기', ru: 'Экспорт' },
  'settings.importRecipes': { en: 'Import Recipes', it: 'Importa Ricette', es: 'Importar Recetas', fr: 'Importer des Recettes', de: 'Rezepte importieren', pt: 'Importar Receitas', ja: 'レシピをインポート', zh: '导入食谱', ko: '레시피 가져오기', ru: 'Импорт рецептов' },
  'settings.importDesc': { en: 'Import from a JSON file', it: 'Importa da un file JSON', es: 'Importar desde un archivo JSON', fr: 'Importer depuis un fichier JSON', de: 'Aus JSON-Datei importieren', pt: 'Importar de um arquivo JSON', ja: 'JSONファイルからインポート', zh: '从JSON文件导入', ko: 'JSON 파일에서 가져오기', ru: 'Импорт из файла JSON' },
  'settings.importBtn': { en: 'Import', it: 'Importa', es: 'Importar', fr: 'Importer', de: 'Importieren', pt: 'Importar', ja: 'インポート', zh: '导入', ko: '가져오기', ru: 'Импорт' },
  'settings.resetDefaults': { en: 'Reset to Defaults', it: 'Ripristina Predefiniti', es: 'Restablecer', fr: 'Reinitialiser', de: 'Zurucksetzen', pt: 'Restaurar Padrao', ja: 'デフォルトに戻す', zh: '恢复默认', ko: '기본값으로 리셋', ru: 'Сброс по умолчанию' },
  'settings.resetDesc': { en: 'Remove all recipes and restore presets', it: 'Rimuovi tutte le ricette e ripristina i preset', es: 'Eliminar todas las recetas y restaurar preajustes', fr: 'Supprimer toutes les recettes et restaurer les predefinis', de: 'Alle Rezepte loschen und Voreinstellungen wiederherstellen', pt: 'Remover todas as receitas e restaurar padroes', ja: '全レシピを削除してプリセットに戻す', zh: '删除所有食谱并恢复预设', ko: '모든 레시피를 삭제하고 기본값 복원', ru: 'Удалить все рецепты и восстановить предустановки' },
  'settings.confirm': { en: 'Confirm', it: 'Conferma', es: 'Confirmar', fr: 'Confirmer', de: 'Bestatigen', pt: 'Confirmar', ja: '確認', zh: '确认', ko: '확인', ru: 'Подтвердить' },
  'settings.resetBtn': { en: 'Reset', it: 'Reset', es: 'Reiniciar', fr: 'Reinitialiser', de: 'Zurucksetzen', pt: 'Reiniciar', ja: 'リセット', zh: '重置', ko: '리셋', ru: 'Сброс' },
  'settings.aboutName': { en: 'ER Kitchen', it: 'ER Kitchen', es: 'ER Kitchen', fr: 'ER Kitchen', de: 'ER Kitchen', pt: 'ER Kitchen', ja: 'ER Kitchen', zh: 'ER Kitchen', ko: 'ER Kitchen', ru: 'ER Kitchen' },
  'settings.aboutDesc': { en: 'AI-powered cooking companion for G2 smart glasses', it: 'Compagno di cucina AI per occhiali G2', es: 'Companero de cocina IA para gafas G2', fr: 'Compagnon de cuisine IA pour lunettes G2', de: 'KI-Kochbegleiter fur G2-Brillen', pt: 'Companheiro de cozinha IA para oculos G2', ja: 'G2スマートグラス用AIクッキングコンパニオン', zh: 'G2智能眼镜AI烹饪伴侣', ko: 'G2 스마트 글래스용 AI 요리 도우미', ru: 'ИИ-помощник для готовки на очках G2' },
  'settings.langDesc': { en: 'App language and AI recipe language', it: 'Lingua dell\'app e delle ricette AI', es: 'Idioma de la app y recetas IA', fr: 'Langue de l\'app et des recettes IA', de: 'App-Sprache und KI-Rezeptsprache', pt: 'Idioma do app e receitas IA', ja: 'アプリの言語とAIレシピの言語', zh: '应用语言和AI食谱语言', ko: '앱 언어 및 AI 레시피 언어', ru: 'Язык приложения и ИИ-рецептов' },
  'settings.importedRecipes': { en: 'Imported {count} recipe(s)', it: 'Importate {count} ricetta/e', es: 'Importadas {count} receta(s)', fr: '{count} recette(s) importee(s)', de: '{count} Rezept(e) importiert', pt: '{count} receita(s) importada(s)', ja: '{count}件のレシピをインポート', zh: '已导入{count}个食谱', ko: '{count}개 레시피 가져옴', ru: 'Импортировано {count} рецепт(ов)' },
  'settings.invalidFormat': { en: 'Invalid recipe file format', it: 'Formato file ricetta non valido', es: 'Formato de archivo no valido', fr: 'Format de fichier invalide', de: 'Ungultiges Dateiformat', pt: 'Formato de arquivo invalido', ja: '無効なレシピファイル形式', zh: '无效的食谱文件格式', ko: '잘못된 레시피 파일 형식', ru: 'Неверный формат файла рецепта' },
  'settings.parseFailed': { en: 'Failed to parse JSON file', it: 'Errore nel parsing del file JSON', es: 'Error al analizar el archivo JSON', fr: 'Erreur d\'analyse du fichier JSON', de: 'JSON-Datei konnte nicht gelesen werden', pt: 'Falha ao analisar o arquivo JSON', ja: 'JSONファイルの解析に失敗', zh: '解析JSON文件失败', ko: 'JSON 파일 분석 실패', ru: 'Ошибка чтения файла JSON' },

  // Recipe Detail - additional
  'recipe.servingsCount': { en: 'servings', it: 'porzioni', es: 'porciones', fr: 'portions', de: 'Portionen', pt: 'porcoes', ja: '人前', zh: '份', ko: '인분', ru: 'порций' },

  // Cooking - additional
  'cooking.stepOf': { en: 'Step {current} of {total}', it: 'Passaggio {current} di {total}', es: 'Paso {current} de {total}', fr: 'Etape {current} de {total}', de: 'Schritt {current} von {total}', pt: 'Passo {current} de {total}', ja: 'ステップ {current} / {total}', zh: '步骤 {current} / {total}', ko: '단계 {current} / {total}', ru: 'Шаг {current} из {total}' },

  // AI Import
  'ai.extractTitle': { en: 'Extract Recipe from URL', it: 'Estrai Ricetta da URL', es: 'Extraer Receta de URL', fr: 'Extraire depuis URL', de: 'Rezept aus URL extrahieren', pt: 'Extrair Receita do URL', ja: 'URLからレシピを抽出', zh: '从URL提取食谱', ko: 'URL에서 레시피 추출', ru: 'Извлечь рецепт из URL' },
  'ai.paste': { en: 'Paste', it: 'Incolla', es: 'Pegar', fr: 'Coller', de: 'Einfugen', pt: 'Colar', ja: '貼り付け', zh: '粘贴', ko: '붙여넣기', ru: 'Вставить' },
  'ai.extract': { en: 'Extract Recipe', it: 'Estrai Ricetta', es: 'Extraer Receta', fr: 'Extraire', de: 'Extrahieren', pt: 'Extrair', ja: '抽出', zh: '提取', ko: '추출', ru: 'Извлечь рецепт' },
  'ai.extracting': { en: 'Extracting...', it: 'Estrazione...', es: 'Extrayendo...', fr: 'Extraction...', de: 'Extrahiere...', pt: 'Extraindo...', ja: '抽出中...', zh: '提取中...', ko: '추출 중...', ru: 'Извлечение...' },
  'ai.analyzing': { en: 'Analyzing recipe...', it: 'Analizzando ricetta...', es: 'Analizando receta...', fr: 'Analyse en cours...', de: 'Analysiere Rezept...', pt: 'Analisando receita...', ja: 'レシピを分析中...', zh: '分析食谱中...', ko: '레시피 분석 중...', ru: 'Анализ рецепта...' },
  'ai.saveToLibrary': { en: 'Save to Library', it: 'Salva in Libreria', es: 'Guardar en Biblioteca', fr: 'Sauvegarder', de: 'Speichern', pt: 'Salvar na Biblioteca', ja: 'ライブラリに保存', zh: '保存到菜谱库', ko: '라이브러리에 저장', ru: 'Сохранить в библиотеку' },
  'ai.saved': { en: 'Saved to library!', it: 'Salvato in libreria!', es: 'Guardado en biblioteca!', fr: 'Sauvegarde!', de: 'Gespeichert!', pt: 'Salvo na biblioteca!', ja: 'ライブラリに保存しました!', zh: '已保存到菜谱库!', ko: '라이브러리에 저장됨!', ru: 'Сохранено в библиотеку!' },
  'ai.clear': { en: 'Clear', it: 'Cancella', es: 'Limpiar', fr: 'Effacer', de: 'Loschen', pt: 'Limpar', ja: 'クリア', zh: '清除', ko: '지우기', ru: 'Очистить' },

  // Completion - additional
  'complete.servingsPrepared': { en: '{count} servings prepared with care.', it: '{count} porzioni preparate con cura.', es: '{count} porciones preparadas con cuidado.', fr: '{count} portions preparees avec soin.', de: '{count} Portionen mit Sorgfalt zubereitet.', pt: '{count} porcoes preparadas com cuidado.', ja: '{count}人前、心を込めて調理しました。', zh: '{count}份，精心烹制。', ko: '{count}인분, 정성껏 준비했습니다.', ru: '{count} порций приготовлено с заботой.' },
  'complete.readyToServe': { en: '{title} is ready to serve.', it: '{title} e pronto da servire.', es: '{title} esta listo para servir.', fr: '{title} est pret a servir.', de: '{title} ist servierfertig.', pt: '{title} esta pronto para servir.', ja: '{title}が出来上がりました。', zh: '{title}可以上菜了。', ko: '{title} 준비되었습니다.', ru: '{title} готово к подаче.' },

  // Library - additional
  'library.newBtn': { en: '+ New', it: '+ Nuova', es: '+ Nueva', fr: '+ Nouveau', de: '+ Neu', pt: '+ Nova', ja: '+ 新規', zh: '+ 新建', ko: '+ 새로', ru: '+ Новый' },

  // Cooking - additional (fallback)
  'cooking.title': { en: 'Cooking', it: 'Cottura', es: 'Cocinando', fr: 'Cuisson', de: 'Kochen', pt: 'Cozinhando', ja: '調理中', zh: '烹饪中', ko: '요리 중', ru: 'Готовка' },

  // AI Import - additional
  'ai.servings': { en: 'servings', it: 'porzioni', es: 'porciones', fr: 'portions', de: 'Portionen', pt: 'porcoes', ja: '人前', zh: '份', ko: '인분', ru: 'порций' },
  'ai.ingredientsCount': { en: 'Ingredients ({count})', it: 'Ingredienti ({count})', es: 'Ingredientes ({count})', fr: 'Ingredients ({count})', de: 'Zutaten ({count})', pt: 'Ingredientes ({count})', ja: '材料 ({count})', zh: '食材 ({count})', ko: '재료 ({count})', ru: 'Ингредиенты ({count})' },
  'ai.stepsCount': { en: 'Steps ({count})', it: 'Passaggi ({count})', es: 'Pasos ({count})', fr: 'Etapes ({count})', de: 'Schritte ({count})', pt: 'Passos ({count})', ja: 'ステップ ({count})', zh: '步骤 ({count})', ko: '단계 ({count})', ru: 'Шаги ({count})' },
  'ai.apiKeyNotSet': { en: '{provider} API key not set', it: 'Chiave API {provider} non impostata', es: 'Clave API de {provider} no configurada', fr: 'Cle API {provider} non definie', de: '{provider} API-Schlussel nicht gesetzt', pt: 'Chave API {provider} nao configurada', ja: '{provider} APIキーが未設定', zh: '{provider} API密钥未设置', ko: '{provider} API 키 미설정', ru: 'API-ключ {provider} не задан' },
  'ai.noResponse': { en: 'No response from AI', it: 'Nessuna risposta dall\'AI', es: 'Sin respuesta de la IA', fr: 'Pas de reponse de l\'IA', de: 'Keine Antwort von KI', pt: 'Sem resposta da IA', ja: 'AIからの応答なし', zh: 'AI无响应', ko: 'AI 응답 없음', ru: 'Нет ответа от ИИ' },
  'ai.extractFailed': { en: 'Failed to extract recipe', it: 'Estrazione ricetta fallita', es: 'Error al extraer la receta', fr: 'Echec de l\'extraction', de: 'Rezept-Extraktion fehlgeschlagen', pt: 'Falha ao extrair receita', ja: 'レシピの抽出に失敗', zh: '提取食谱失败', ko: '레시피 추출 실패', ru: 'Не удалось извлечь рецепт' },
  'ai.urlPlaceholder': { en: 'https://example.com/recipe...', it: 'https://esempio.com/ricetta...', es: 'https://ejemplo.com/receta...', fr: 'https://exemple.com/recette...', de: 'https://beispiel.de/rezept...', pt: 'https://exemplo.com/receita...', ja: 'https://example.com/recipe...', zh: 'https://example.com/recipe...', ko: 'https://example.com/recipe...', ru: 'https://example.com/recipe...' },

  // Form - additional
  'form.untitledRecipe': { en: 'Untitled Recipe', it: 'Ricetta senza titolo', es: 'Receta sin titulo', fr: 'Recette sans titre', de: 'Rezept ohne Titel', pt: 'Receita sem titulo', ja: '無題のレシピ', zh: '无标题食谱', ko: '제목 없는 레시피', ru: 'Рецепт без названия' },
  'form.uncategorized': { en: 'Uncategorized', it: 'Senza categoria', es: 'Sin categoria', fr: 'Non categorise', de: 'Nicht kategorisiert', pt: 'Sem categoria', ja: '未分類', zh: '未分类', ko: '미분류', ru: 'Без категории' },

  // RecipeCard
  'card.serv': { en: 'serv.', it: 'porz.', es: 'porc.', fr: 'port.', de: 'Port.', pt: 'porç.', ja: '人前', zh: '份', ko: '인분', ru: 'порц.' },

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
