<template>
  <div class="markdown-renderer" v-html="parsedMarkdown"></div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import Showdown from 'showdown';

export default defineComponent({
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // Configurar Showdown con opciones mejoradas
    const converter = new Showdown.Converter({
      // Habilitar extensiones útiles
      tables: true,
      strikethrough: true,
      tasklists: true,
      emoji: true,
      underline: true,
      simpleLineBreaks: true,
      openLinksInNewWindow: true,
      backslashEscapesHTMLTags: true,
      ghCodeBlocks: true,
      ghCompatibleHeaderId: true,
      parseImgDimensions: true,
      simplifiedAutoLink: true,
      excludeTrailingPunctuationFromURLs: true,
      literalMidWordUnderscores: true,
      
      // Configuración de seguridad
      noHeaderId: false,
      headerLevelStart: 1,
      
      // Configuraciones adicionales
      completeHTMLDocument: false,
      metadata: false,
      splitAdjacentBlockquotes: true,
    });

    // Computed que parsea el markdown usando Showdown
    const parsedMarkdown = computed(() => {
      if (!props.content) return '';
      
      try {
        // Convertir markdown a HTML usando Showdown
        let html = converter.makeHtml(props.content);
        
        // Post-procesamiento para mejorar seguridad y funcionalidad
        html = html
          // Asegurar que todos los enlaces externos se abran en nueva ventana
          .replace(/<a href="http/g, '<a target="_blank" rel="noopener noreferrer" href="http')
          // Añadir clases CSS a elementos específicos para mejor estilizado
          .replace(/<table>/g, '<table class="markdown-table">')
          .replace(/<code>/g, '<code class="markdown-inline-code">')
          .replace(/<pre><code/g, '<pre><code class="markdown-code-block"')
          .replace(/<blockquote>/g, '<blockquote class="markdown-blockquote">');
        
        return html;
      } catch (error) {
        console.error('Error parsing markdown:', error);
        // Fallback: mostrar el contenido raw si hay error
        return `<pre>${props.content}</pre>`;
      }
    });

    return {
      parsedMarkdown,
    };
  },
});
</script>

<style scoped>
.markdown-renderer {
  color: #d1d5db;
  line-height: 1.6;
}

/* Estilos para elementos de markdown */
.markdown-renderer :deep(h1) {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 1.5rem 0 1rem 0;
  border-bottom: 2px solid #3b82f6;
  padding-bottom: 0.5rem;
}

.markdown-renderer :deep(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 1.25rem 0 0.75rem 0;
  border-bottom: 1px solid #4b5563;
  padding-bottom: 0.25rem;
}

.markdown-renderer :deep(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 1rem 0 0.5rem 0;
}

.markdown-renderer :deep(h4) {
  font-size: 1.125rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0.75rem 0 0.5rem 0;
}

.markdown-renderer :deep(h5) {
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
  margin: 0.5rem 0 0.25rem 0;
}

.markdown-renderer :deep(h6) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #d1d5db;
  margin: 0.5rem 0 0.25rem 0;
}

.markdown-renderer :deep(p) {
  margin: 0.75rem 0;
  color: #d1d5db;
  line-height: 1.6;
}

.markdown-renderer :deep(strong) {
  font-weight: 700;
  color: #fff;
}

.markdown-renderer :deep(em) {
  font-style: italic;
  color: #e5e7eb;
}

.markdown-renderer :deep(code) {
  background-color: #374151;
  color: #f59e0b;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
}

.markdown-renderer :deep(pre) {
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin: 1rem 0;
}

.markdown-renderer :deep(pre code) {
  background: none;
  color: #d1d5db;
  padding: 0;
  border-radius: 0;
  font-size: 0.875rem;
}

.markdown-renderer :deep(a) {
  color: #3b82f6;
  text-decoration: underline;
  transition: color 0.2s;
}

.markdown-renderer :deep(a:hover) {
  color: #60a5fa;
}

.markdown-renderer :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  margin: 1rem 0;
  border: 1px solid #374151;
}

.markdown-renderer :deep(ul) {
  list-style-type: disc;
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-renderer :deep(ol) {
  list-style-type: decimal;
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-renderer :deep(li) {
  margin: 0.5rem 0;
  color: #d1d5db;
  line-height: 1.5;
}

.markdown-renderer :deep(li ul),
.markdown-renderer :deep(li ol) {
  margin: 0.25rem 0;
}

.markdown-renderer :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  color: #9ca3af;
  font-style: italic;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 0 0.25rem 0.25rem 0;
}

.markdown-renderer :deep(hr) {
  border: none;
  height: 2px;
  background: linear-gradient(to right, transparent, #4b5563, transparent);
  margin: 2rem 0;
}

.markdown-renderer :deep(del) {
  text-decoration: line-through;
  color: #9ca3af;
}

/* Estilos para tablas */
.markdown-renderer :deep(.markdown-table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  overflow: hidden;
}

.markdown-renderer :deep(.markdown-table th) {
  background-color: #374151;
  color: #fff;
  font-weight: 600;
  padding: 0.75rem;
  text-align: left;
  border-bottom: 2px solid #4b5563;
}

.markdown-renderer :deep(.markdown-table td) {
  padding: 0.75rem;
  border-bottom: 1px solid #374151;
  color: #d1d5db;
}

.markdown-renderer :deep(.markdown-table tbody tr:hover) {
  background-color: rgba(59, 130, 246, 0.1);
}

.markdown-renderer :deep(.markdown-table tbody tr:last-child td) {
  border-bottom: none;
}

/* Estilos para task lists */
.markdown-renderer :deep(input[type="checkbox"]) {
  margin-right: 0.5rem;
  accent-color: #3b82f6;
}

.markdown-renderer :deep(li input[type="checkbox"]) {
  margin-left: -1.5rem;
  margin-right: 0.5rem;
}

/* Estilos para código con syntax highlighting mejorado */
.markdown-renderer :deep(.markdown-code-block) {
  color: #e5e7eb;
  background: transparent;
}

.markdown-renderer :deep(.markdown-inline-code) {
  color: #fbbf24;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

/* Responsive */
@media (max-width: 640px) {
  .markdown-renderer :deep(h1) {
    font-size: 1.5rem;
  }
  
  .markdown-renderer :deep(h2) {
    font-size: 1.25rem;
  }
    .markdown-renderer :deep(h3) {
    font-size: 1.125rem;
  }
  
  .markdown-renderer :deep(h4) {
    font-size: 1rem;
  }
  
  .markdown-renderer :deep(blockquote) {
    padding-left: 0.75rem;
    margin: 0.75rem 0;
  }
  
  .markdown-renderer :deep(pre) {
    padding: 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
