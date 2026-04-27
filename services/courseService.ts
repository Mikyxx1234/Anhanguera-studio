import { CoursePrice, Course } from '../lib/supabase';
import { apiGet } from '../lib/apiProxy';

export class CourseService {
  /**
   * Busca o preço de um curso específico por modalidade
   */
  static async getCoursePrice(courseName: string, modality: string): Promise<CoursePrice | null> {
    try {
      const cursos = await apiGet('/api/cursos/graduacao');
      const curso = cursos.find((c: any) => c.nome === courseName && c.modalidade === modality);
      
      if (!curso) return null;

      // Converter para o formato esperado pelo componente
      return {
        id: curso.id,
        course_name: curso.nome,
        modality: curso.modalidade,
        price: parseFloat(curso.preco) || 0,
        formation_type: curso.tipo,
        duration: curso.duracao,
        description: curso.descricao,
        area: curso.area,
        categoria: '',
        ativo: true
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Busca todos os preços disponíveis para um curso
   */
  static async getAllCoursePrices(courseName: string): Promise<CoursePrice[]> {
    try {
      const cursos = await apiGet('/api/cursos/graduacao');
      const cursosFiltrados = cursos.filter((c: any) => c.nome === courseName);

      // Converter para o formato esperado pelo componente
      return cursosFiltrados.map((curso: any) => ({
        id: curso.id,
        course_name: curso.nome,
        modality: curso.modalidade,
        price: parseFloat(curso.preco) || 0,
        formation_type: curso.tipo,
        duration: curso.duracao,
        description: curso.descricao,
        area: curso.area,
        categoria: '',
        ativo: true
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Busca informações completas de um curso
   */
  static async getCourse(courseName: string): Promise<Course | null> {
    try {
      const cursos = await apiGet('/api/cursos/graduacao');
      const curso = cursos.find((c: any) => c.nome === courseName);

      if (!curso) return null;

      // Converter para o formato esperado pelo componente
      return {
        id: curso.id,
        name: curso.nome,
        area: curso.area,
        formation: curso.tipo,
        modality: curso.modalidade,
        duration: curso.duracao,
        description: curso.descricao,
        categoria: '',
        ativo: true
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Busca preços com fallback para dados locais
   */
  static async getCoursePriceWithFallback(
    courseName: string, 
    modality: string, 
    fallbackPrice: number
  ): Promise<{ price: number; source: 'database' | 'fallback' }> {
    const coursePrice = await this.getCoursePrice(courseName, modality);
    
    if (coursePrice) {
      return {
        price: coursePrice.price,
        source: 'database'
      };
    }

    // Se não encontrar no banco, usa o preço local como fallback
    return {
      price: fallbackPrice,
      source: 'fallback'
    };
  }

  /**
   * Busca todos os cursos de graduação do banco
   */
  static async getAllGraduationCourses(): Promise<any[]> {
    try {
      const cursos = await apiGet('/api/cursos/graduacao');

      if (!Array.isArray(cursos)) {
        console.error('❌ Resposta inválida do banco - não é array');
        return [];
      }

      // Converter para o formato esperado pelos componentes
      return cursos.map((curso: any) => ({
        id: curso.id,
        name: curso.nome,
        duration: curso.duracao || '',
        formation: curso.tipo || 'Bacharelado',
        modality: curso.modalidade,
        area: curso.area || 'Geral',
        description: curso.descricao || '',
        price: parseFloat(curso.preco) || 299.90
      }));
    } catch (error: any) {
      console.error('❌ Erro ao buscar cursos de graduação:', error.message);
      return [];
    }
  }

  /**
   * Busca cursos filtrados por área
   */
  static async getCoursesByArea(area: string): Promise<any[]> {
    try {
      const cursos = await apiGet('/api/cursos/graduacao');
      const cursosFiltrados = cursos.filter((c: any) => c.area === area);

      return cursosFiltrados.map((curso: any) => ({
        id: curso.id,
        name: curso.nome,
        duration: curso.duracao || '',
        formation: curso.tipo || 'Bacharelado',
        modality: curso.modalidade,
        area: curso.area || 'Geral',
        description: curso.descricao || '',
        price: parseFloat(curso.preco) || 299.90
      }));
    } catch (error) {
      return [];
    }
  }

  /**
   * Busca todas as áreas distintas dos cursos
   */
  static async getCourseAreas(): Promise<string[]> {
    try {
      const areas = await apiGet('/api/cursos/areas');
      const areasList = areas.map((item: any) => item.area).filter((a: any) => a);
      
      return ['Todos', ...areasList.sort()];
    } catch (error) {
      return ['Todos'];
    }
  }

  /**
   * Busca todos os cursos de pós-graduação do banco
   */
  static async getAllPostGradCourses(): Promise<any[]> {
    try {
      const cursos = await apiGet('/api/cursos/pos');

      if (!Array.isArray(cursos)) {
        console.error('❌ Resposta inválida do banco Pós - não é array');
        return [];
      }

      // Converter para o formato esperado pelos componentes
      return cursos.map((curso: any) => {
        const normalPrice = parseFloat(curso.normal);
        const intensivoPrice = parseFloat(curso.intensivo);
        
        return {
          id: curso.id,
          name: curso.nome_curso,
          duration: curso.carga_horaria ? `${curso.carga_horaria}h` : '360h',
          formation: 'Especialista',
          modality: 'EAD',
          area: curso.area || 'Geral',
          description: `Especialização em ${curso.nome_curso}`,
          price: normalPrice || 199.90,
          priceNormal: normalPrice > 0 ? normalPrice : null,
          priceIntensive: intensivoPrice > 0 ? intensivoPrice : null,
          posDoSeuJeito: true
        };
      });
    } catch (error: any) {
      console.error('❌ Erro ao buscar cursos de pós:', error.message);
      return [];
    }
  }

  /**
   * Busca áreas distintas dos cursos de pós-graduação
   */
  static async getPostGradAreas(): Promise<string[]> {
    try {
      const areas = await apiGet('/api/cursos/pos/areas');
      const areasList = areas.map((item: any) => item.area).filter((a: any) => a);
      
      return ['Todos', ...areasList.sort()];
    } catch (error) {
      return ['Todos'];
    }
  }
}
