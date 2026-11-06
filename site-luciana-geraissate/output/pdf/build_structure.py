from pathlib import Path
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import cm

ROOT = Path(__file__).resolve().parents[2]
OUT = Path(__file__).with_name('estrutura-site-luciana-geraissate.pdf')
pdfmetrics.registerFont(TTFont('Manrope', str(ROOT/'assets/fonts/manrope-400.ttf')))
pdfmetrics.registerFont(TTFont('ManropeSemi', str(ROOT/'assets/fonts/manrope-600.ttf')))
pdfmetrics.registerFont(TTFont('Cormorant', str(ROOT/'assets/fonts/cormorant-garamond-400.ttf')))
forest=colors.HexColor('#234433'); gold=colors.HexColor('#9F743D'); coffee=colors.HexColor('#514339'); cream=colors.HexColor('#F8F4EB')
styles=getSampleStyleSheet()
styles.add(ParagraphStyle(name='CoverTitleX',fontName='ManropeSemi',fontSize=30,leading=37,textColor=forest,spaceAfter=16))
styles.add(ParagraphStyle(name='SectionX',fontName='ManropeSemi',fontSize=18,leading=24,textColor=forest,spaceBefore=11,spaceAfter=10))
styles.add(ParagraphStyle(name='SubX',fontName='ManropeSemi',fontSize=11,leading=16,textColor=forest,spaceBefore=10,spaceAfter=4))
styles.add(ParagraphStyle(name='BodyX',fontName='Manrope',fontSize=9,leading=15,textColor=coffee,spaceAfter=7))
styles.add(ParagraphStyle(name='SmallX',fontName='Manrope',fontSize=8,leading=12,textColor=coffee,spaceAfter=4))
styles.add(ParagraphStyle(name='QuoteX',fontName='Cormorant',fontSize=19,leading=24,textColor=gold,spaceAfter=12))
styles.add(ParagraphStyle(name='EyebrowX',fontName='ManropeSemi',fontSize=8,leading=12,textColor=gold,spaceAfter=7))

doc=SimpleDocTemplate(str(OUT),pagesize=(21*cm,29.7*cm),rightMargin=2*cm,leftMargin=2*cm,topMargin=2.1*cm,bottomMargin=1.9*cm)
story=[]
P=lambda t,s='BodyX': Paragraph(t,styles[s])
def sec(n,title,summary):
    story.append(P(f'SEÇÃO {n:02d}','EyebrowX'))
    story.append(P(title,'SectionX'))
    story.append(P(summary))
def line(label,text):
    story.append(P(label,'SubX'));story.append(P(text))
def page():story.append(PageBreak())

story += [Spacer(1,2.2*cm),P('LUCIANA GERAISSATE','EyebrowX'),P('Estrutura completa<br/>do site','CoverTitleX'),P('Guia objetivo, seção por seção, com o estado atual da página e o que ainda precisa de confirmação.','BodyX'),Spacer(1,.7*cm),P('04 de novembro de 2026','SmallX'),Spacer(1,1.4*cm)]
story.append(P('Visão geral','SectionX'))
for x in ['01  Menu e abertura','02  O que te incomoda?','03  Como cuidamos','04  Depoimentos','05  A clínica','06  Perguntas frequentes','07  Contato e rodapé']:
    story.append(P(x,'BodyX'))
story.append(Spacer(1,.6*cm));story.append(P('Paleta: verde profundo, creme, marrom e dourado sutil. Tipografia: Manrope para interface e Cormorant Garamond para ênfases editoriais.','SmallX'))
page()

sec(1,'Menu e abertura','Apresenta a proposta da clínica e conduz à avaliação.')
line('Menu','A clínica · Nossos tratamentos · Como cuidamos · Contato. Navegação adaptada para desktop, tablet e celular, com botão Agendar e logo no cabeçalho ao avançar a página.')
line('Mensagem principal','“Entenda a dor. Acompanhe a evolução.” Logo de Luciana e retrato compõem o hero.')
line('Barra de pilares','Quatro etapas: Avaliação completa, Mapa Funcional, Plano escrito e Evolução medida. Cada uma usa um ícone relacionado ao seu significado.')
line('Ação','Botão “Conheça a clínica” abaixo da barra. Botões verdes usam vidro suave, sombra leve e expansão discreta ao passar o mouse.')
sec(2,'O que te incomoda?','Seis queixas em linguagem de paciente, ligadas a seis painéis de tratamento.')
line('Como funciona','Abas em linha única, com rolagem horizontal no celular. Clique, teclado ou arraste selecionam o card central. O card aberto mostra tratamento, descrição e até três recursos. Cada recurso revela uma etapa ilustrativa do cuidado. Não há rotação automática.')
mapping=[('Minha dor não passa','Fisioterapia para dor crônica'),('Meu ombro ou joelho dói','Fisioterapia traumato-ortopédica'),('Tenho medo de voltar','Pós-reabilitação e retorno ao esporte'),('Quero manter minha força','Envelhecimento ativo'),('Vou operar ou já operei','Reabilitação pré e pós-cirúrgica'),('Quero evitar lesões','Avaliação de risco de lesão')]
rows=[[P('QUEIXA','SmallX'),P('TRATAMENTO','SmallX')]]+[[P(a,'SmallX'),P(b,'SmallX')] for a,b in mapping]
t=Table(rows,colWidths=[7.3*cm,8.6*cm]);t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),cream),('LINEBELOW',(0,0),(-1,0),.8,gold),('BOTTOMPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('VALIGN',(0,0),(-1,-1),'TOP')]))
story.append(t)
story.append(P('Imagens novas: seis cenas horizontais ilustrativas. Ícones clínicos em verde, creme e dourado suave, ligados ao sentido de cada texto. As cenas foram criadas a partir de referências visuais da Luciana e não documentam atendimentos reais.','SmallX'))
page()

sec(3,'Como cuidamos','Explica a sequência de cuidado com três cartões interativos e imagens.')
story.append(P('“Talvez você já tenha feito sessões curtas com aparelhos, pilates em turma grande, ou tomado remédio e esperado passar. Aliviou por um tempo, e a dor voltou. Aqui o cuidado começa de outro jeito.','QuoteX'))
line('01 · Avaliação completa com a Luciana','Conversa, testes funcionais e exercícios para entender por que dói, não só onde.')
line('02 · Mapa Funcional e plano escrito','Mapa do caso, frequência e formato das sessões definidos com a pessoa.')
line('03 · Reavaliações com os mesmos marcadores','Medições repetidas para acompanhar evolução com dados comparáveis.')
line('Recursos do plano','Pilates clínico, terapia manual, dinamometria e drenagem linfática. Atendimento presencial na Consolação e possibilidade de teleconsulta.')
sec(4,'Depoimentos','Três avaliações em cartões compactos com iniciais, estrelas e navegação manual.')
line('Pessoas apresentadas','Bension Waksman, Marcela Pousada e Renato Nisenbaum. As iniciais substituem retratos que não foram fornecidos. Os relatos são os presentes no conteúdo atual do site.')
line('Interação','Setas avançam entre os cartões. No celular, o cartão selecionado rola para o centro. Não há avanço automático.')
page()
sec(5,'A clínica','Apresenta a profissional, o espaço e os dados de confiança.')
line('Conteúdo','Luciana Geraissate, fisioterapeuta há mais de 20 anos; clínica fundada em 2014; primeira consulta com ela; equipe alinhada ao plano; endereço na Consolação.')
line('Galeria','Recepção, sala de Pilates e consultório. As vistas atuais são ilustrativas, elaboradas a partir de fotografias do espaço, e assim identificadas no texto alternativo.')
sec(6,'Perguntas frequentes','Respostas em sanfona para dúvidas antes da avaliação.')
for q in ['Movimento pode piorar a dor?','O que muda em relação a outros tratamentos?','Como é a primeira consulta?','Há aula experimental?','Qual o preço?','Aceita convênio ou reembolso?','Onde fica a clínica?']:
    story.append(P('• '+q,'BodyX'))
sec(7,'Contato e rodapé','Convite final para agendar a avaliação.')
line('Chamada','“O primeiro passo é entender o seu caso.” O botão de agendamento leva ao WhatsApp da clínica.')
line('Atendimento','Av. Angélica, 1968, conj. 62/63, Consolação, São Paulo. Recepção: segunda a quinta, 8h–18h; sexta, 7h–15h. Instagram no cabeçalho e no rodapé.')
story.append(Spacer(1,.3*cm));story.append(P('Antes de publicar','SubX'))
story.append(P('Confirmar pós-graduações, duração e preço da consulta, aula experimental, convênio, reembolso, metrô, estacionamento e link das avaliações no Google. O site mantém marcadores onde faltam esses dados.','SmallX'))

def decorate(canvas,doc):
    canvas.saveState();w,h=doc.pagesize
    canvas.setFillColor(forest);canvas.rect(0,h-0.42*cm,w,0.42*cm,fill=1,stroke=0)
    canvas.setFont('Manrope',7);canvas.setFillColor(coffee)
    canvas.drawString(2*cm,1*cm,'Luciana Geraissate · Estrutura do site')
    canvas.drawRightString(w-2*cm,1*cm,f'{doc.page}')
    canvas.restoreState()
doc.build(story,onFirstPage=decorate,onLaterPages=decorate)
print(OUT)
