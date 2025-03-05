
import { Language, TranslationDict } from './types';

// Default translations for fallback
export const defaultTranslations: Record<Language, TranslationDict> = {
  [Language.EN]: {
    common: {
      loading: 'Loading...',
      error: 'An error occurred',
      retry: 'Retry',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      delete: 'Delete',
      edit: 'Edit',
      view: 'View',
      search: 'Search'
    },
    insights: {
      title: 'Health Insights',
      correlations: 'Weight Loss Correlations',
      recommendations: 'Recommendations',
      timePeriod: 'Time Period',
      weeklyProgress: 'Weekly Progress'
    }
  },
  [Language.ES]: {
    common: {
      loading: 'Cargando...',
      error: 'Se produjo un error',
      retry: 'Reintentar',
      save: 'Guardar',
      cancel: 'Cancelar',
      close: 'Cerrar',
      delete: 'Eliminar',
      edit: 'Editar',
      view: 'Ver',
      search: 'Buscar'
    },
    insights: {
      title: 'Información de Salud',
      correlations: 'Correlaciones de Pérdida de Peso',
      recommendations: 'Recomendaciones',
      timePeriod: 'Período de Tiempo',
      weeklyProgress: 'Progreso Semanal'
    }
  },
  [Language.FR]: {
    common: {
      loading: 'Chargement...',
      error: 'Une erreur est survenue',
      retry: 'Réessayer',
      save: 'Enregistrer',
      cancel: 'Annuler',
      close: 'Fermer',
      delete: 'Supprimer',
      edit: 'Modifier',
      view: 'Afficher',
      search: 'Rechercher'
    },
    insights: {
      title: 'Informations sur la Santé',
      correlations: 'Corrélations de Perte de Poids',
      recommendations: 'Recommandations',
      timePeriod: 'Période',
      weeklyProgress: 'Progrès Hebdomadaire'
    }
  },
  [Language.DE]: {
    common: {
      loading: 'Wird geladen...',
      error: 'Ein Fehler ist aufgetreten',
      retry: 'Wiederholen',
      save: 'Speichern',
      cancel: 'Abbrechen',
      close: 'Schließen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      view: 'Ansehen',
      search: 'Suchen'
    },
    insights: {
      title: 'Gesundheitseinblicke',
      correlations: 'Gewichtsverlust-Korrelationen',
      recommendations: 'Empfehlungen',
      timePeriod: 'Zeitraum',
      weeklyProgress: 'Wöchentlicher Fortschritt'
    }
  },
  [Language.JA]: {
    common: {
      loading: '読み込み中...',
      error: 'エラーが発生しました',
      retry: '再試行',
      save: '保存',
      cancel: 'キャンセル',
      close: '閉じる',
      delete: '削除',
      edit: '編集',
      view: '表示',
      search: '検索'
    },
    insights: {
      title: '健康分析',
      correlations: '体重減少の相関関係',
      recommendations: '推奨事項',
      timePeriod: '期間',
      weeklyProgress: '週間進捗'
    }
  }
};
