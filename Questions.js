(() => {

    const Labels      = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const AutoDelay   = 1800;

    let CurrentIndex = 0;
    let AutoInterval = null;
    let AutoRunning  = false;

    function Clean(Text) {
        return Text?.replace(/<[^>]+>/g, '').trim() ?? '';
    }

    function IsValidQuestions(Arr) {
        return Array.isArray(Arr) &&
            Arr.length > 0       &&
            Arr[0].id     != null &&
            Arr[0].answers != null;
    }

    function DeepSearch(Obj, Visited = new Set()) {
        if (!Obj || typeof Obj !== 'object') return null;
        if (Visited.has(Obj)) return null;
        Visited.add(Obj);
        if (Obj.questions && IsValidQuestions(Obj.questions)) return Obj.questions;
        if (IsValidQuestions(Obj)) return Obj;
        for (const Key in Obj) {
            try {
                const Result = DeepSearch(Obj[Key], Visited);
                if (Result) return Result;
            } catch {}
        }
        return null;
    }

    ['QapRoot', 'QapStyle', 'QapSplash', 'QapSplashStyle'].forEach(Id => {
        document.getElementById(Id)?.remove();
    });

    const Found     = DeepSearch(window);
    const Questions = Found ?? [];

    const SplashStyleEl       = document.createElement('style');
    SplashStyleEl.id          = 'QapSplashStyle';
    SplashStyleEl.textContent = `
        @keyframes QapSplashPulse {
            0%,100% { background:rgba(13,11,20,0.97); }
            50%      { background:rgba(38,33,92,0.99); }
        }

        @keyframes QapSplashFadeIn {
            from { opacity:0; transform:translateY(-10px); }
            to   { opacity:1; transform:translateY(0); }
        }

        @keyframes QapSplashFadeOut {
            from { opacity:1; transform:scale(1); }
            to   { opacity:0; transform:scale(1.03); }
        }

        @keyframes QapSplashGlow {
            0%,100% {
                text-shadow:
                    0 0 12px rgba(127,119,221,0.4),
                    0 0 32px rgba(83,74,183,0.15);
            }
            50% {
                text-shadow:
                    0 0 28px rgba(175,169,236,0.85),
                    0 0 64px rgba(127,119,221,0.38);
            }
        }

        @keyframes QapSplashShimmer {
            0%   { background-position:200% center; }
            100% { background-position:-200% center; }
        }

        @keyframes QapSplashDot {
            0%,100% { opacity:0.3; transform:scale(0.8); }
            50%      { opacity:1;   transform:scale(1.2); }
        }

        @keyframes QapSplashN {
            0%,90%,100% { opacity:1; }
            92%          { opacity:0.15; }
            95%          { opacity:1; }
            98%          { opacity:0.3; }
        }

        @keyframes QapSplashRadial {
            0%,100% { transform:translate(-50%,-50%) scale(1); opacity:0.5; }
            50%      { transform:translate(-50%,-50%) scale(1.12); opacity:1; }
        }

        #QapSplash {
            position:fixed;
            inset:0;
            z-index:2147483647;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            animation:QapSplashPulse 2.8s ease infinite;
            overflow:hidden;
        }

        #QapSplash.QapSplashOut {
            animation:QapSplashFadeOut 0.4s ease both;
        }

        #QapSplashTopBar {
            position:absolute;
            top:0; left:0; right:0;
            height:3px;
            background:linear-gradient(
                90deg,
                #26215C,
                #7F77DD,
                #AFA9EC,
                #7F77DD,
                #26215C
            );
            background-size:200% auto;
            animation:QapSplashShimmer 3s linear infinite;
        }

        #QapSplashBottomBar {
            position:absolute;
            bottom:0; left:0; right:0;
            height:3px;
            background:linear-gradient(
                90deg,
                #26215C,
                #7F77DD,
                #AFA9EC,
                #7F77DD,
                #26215C
            );
            background-size:200% auto;
            animation:QapSplashShimmer 3s linear infinite;
        }

        #QapSplashRadialGlow {
            position:absolute;
            top:50%; left:50%;
            transform:translate(-50%,-50%);
            width:420px;
            height:420px;
            border-radius:50%;
            background:radial-gradient(
                circle,
                rgba(83,74,183,0.09) 0%,
                transparent 70%
            );
            pointer-events:none;
            animation:QapSplashRadial 3.5s ease infinite;
        }

        #QapSplashDotsRow {
            display:flex;
            align-items:center;
            gap:9px;
            margin-bottom:16px;
            animation:QapSplashFadeIn 0.5s ease both;
        }

        .QapSplashDot {
            width:8px;
            height:8px;
            border-radius:50%;
            background:#7F77DD;
        }

        .QapSplashDot:nth-child(1) { animation:QapSplashDot 1.4s ease infinite 0s; }
        .QapSplashDot:nth-child(3) { animation:QapSplashDot 1.4s ease infinite 0.7s; }

        #QapSplashSysLabel {
            font-size:11px;
            font-weight:700;
            letter-spacing:0.14em;
            color:#534AB7;
            text-transform:uppercase;
            font-family:system-ui,-apple-system,sans-serif;
        }

        #QapSplashSubtitle {
            font-size:13px;
            font-weight:700;
            letter-spacing:0.22em;
            color:#4E4B6A;
            text-transform:uppercase;
            font-family:system-ui,-apple-system,sans-serif;
            margin-bottom:10px;
            animation:QapSplashFadeIn 0.5s ease both 0.1s;
        }

        #QapSplashTitle {
            font-size:46px;
            font-weight:800;
            letter-spacing:0.04em;
            color:#E8E6FF;
            font-family:system-ui,-apple-system,sans-serif;
            text-transform:uppercase;
            text-align:center;
            line-height:1.1;
            animation:
                QapSplashFadeIn 0.6s ease both 0.2s,
                QapSplashGlow   2.4s ease infinite;
        }

        #QapSplashDivider {
            width:180px;
            height:1px;
            background:linear-gradient(90deg, transparent, #534AB7, transparent);
            margin:22px 0 16px;
            animation:QapSplashFadeIn 0.5s ease both 0.35s;
        }

        #QapSplashCount {
            font-size:11px;
            color:#6B6890;
            letter-spacing:0.1em;
            font-family:system-ui,-apple-system,sans-serif;
            animation:QapSplashFadeIn 0.5s ease both 0.45s;
        }

        #QapSplashNWrap {
            position:absolute;
            bottom:32px;
            left:48.5%;
            transform:translateX(-70%);

            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;

            gap:6px;

            animation:QapSplashFadeIn 0.5s ease both 0.6s;
        }

        #QapSplashN {
            font-size:20px;
            font-weight:900;
            color:#AFA9EC;

            font-family:Arial,sans-serif;

            letter-spacing:0;
            line-height:1;
            text-align:center;

            display:block;
        }

        #QapSplashNLine {
            width:36px;
            height:2px;
            background:linear-gradient(90deg, transparent, #7F77DD, transparent);
            background-size:200% auto;
            animation:QapSplashShimmer 3s linear infinite;
        }
    `;
    document.head.appendChild(SplashStyleEl);

    const SplashEl    = document.createElement('div');
    SplashEl.id       = 'QapSplash';
    SplashEl.innerHTML = `
        <div id="QapSplashTopBar"></div>
        <div id="QapSplashBottomBar"></div>
        <div id="QapSplashRadialGlow"></div>

        <div id="QapSplashDotsRow">
            <div class="QapSplashDot"></div>
            <span id="QapSplashSysLabel">Sistema Ativo</span>
            <div class="QapSplashDot"></div>
        </div>

        <div id="QapSplashTitle">SCRIPT<br>INICIADO</div>

        <div id="QapSplashDivider"></div>

        <div id="QapSplashCount">${
            Questions.length > 0
                ? `${Questions.length} questões carregada(s)`
                : '⚠ Nenhuma questão encontrada'
        }</div>

        
    `;
    document.body.appendChild(SplashEl);

    setTimeout(() => {
        SplashEl.classList.add('QapSplashOut');
        setTimeout(() => {
            SplashEl.remove();
            SplashStyleEl.remove();
            InitPanel();
        }, 420);
    }, 1500);

    function InitPanel() {

        const StyleEl       = document.createElement('style');
        StyleEl.id          = 'QapStyle';
        StyleEl.textContent = `
            @keyframes QapIn {
                from { opacity:0; transform:translateY(14px) scale(.96) }
                to   { opacity:1; transform:translateY(0) scale(1) }
            }

            @keyframes QapOut {
                from { opacity:1; transform:translateY(0) scale(1) }
                to   { opacity:0; transform:translateY(14px) scale(.96) }
            }

            @keyframes QapRow {
                from { opacity:0; transform:translateX(-8px) }
                to   { opacity:1; transform:translateX(0) }
            }

            @keyframes QapDot {
                0%,100% { box-shadow:0 0 0 0 rgba(175,169,236,0) }
                50%      { box-shadow:0 0 0 4px rgba(175,169,236,0.25) }
            }

            @keyframes QapSpin {
                to { transform:rotate(360deg) }
            }

            @keyframes QapGlow {
                0%,100% { box-shadow:0 0 0 1px rgba(127,119,221,0.18) }
                50%      {
                    box-shadow:
                        0 0 0 2px rgba(127,119,221,0.35),
                        0 0 12px rgba(127,119,221,0.12);
                }
            }

            @keyframes QapShimmer {
                0%   { background-position:200% center }
                100% { background-position:-200% center }
            }

            #QapRoot *,
            #QapRoot *::before,
            #QapRoot *::after {
                box-sizing:border-box;
                margin:0;
                padding:0;
                font-family:system-ui,-apple-system,sans-serif;
            }

            #QapRoot {
                position:fixed;
                bottom:16px;
                right:16px;
                z-index:2147483647;

                width:290px;
                max-height:74vh;

                display:flex;
                flex-direction:column;

                border-radius:14px;
                overflow:hidden;

                background:#0D0B14;
                border:1px solid rgba(127,119,221,0.22);

                box-shadow:
                    0 12px 35px rgba(0,0,0,.55),
                    inset 0 1px 0 rgba(255,255,255,.04);

                animation:QapIn .28s ease both;
            }

            #QapRoot.QapClosing {
                animation:QapOut .18s ease both;
            }

            #QapTopBar {
                height:2px;
                background:linear-gradient(90deg, #26215C, #7F77DD, #AFA9EC);
                background-size:200% auto;
                animation:QapShimmer 3s linear infinite;
                flex-shrink:0;
            }

            #QapHeader {
                display:flex;
                align-items:center;
                justify-content:space-between;

                padding:8px 10px;

                border-bottom:1px solid rgba(127,119,221,.12);
                background:rgba(30,24,58,.82);

                flex-shrink:0;
                cursor:grab;
            }

            #QapHeader:active { cursor:grabbing; }

            #QapHL {
                display:flex;
                align-items:center;
                gap:6px;
            }

            #QapDot {
                width:7px;
                height:7px;
                border-radius:50%;
                background:#7F77DD;
                flex-shrink:0;
                animation:QapDot 2s ease infinite;
            }

            #QapTitle {
                font-size:11px;
                font-weight:700;
                color:#E8E6FF;
                letter-spacing:.04em;
                text-transform:uppercase;
            }

            #QapBadge {
                font-size:9px;
                font-weight:600;
                background:rgba(127,119,221,.15);
                color:#AFA9EC;
                border:1px solid rgba(127,119,221,.22);
                border-radius:999px;
                padding:1px 6px;
            }

            #QapHR {
                display:flex;
                align-items:center;
                gap:3px;
            }

            .QapIBtn {
                width:21px;
                height:21px;
                border-radius:5px;
                border:none;
                background:transparent;
                cursor:pointer;
                color:#6B6890;
                font-size:11px;
                display:flex;
                align-items:center;
                justify-content:center;
                transition:.12s;
            }

            .QapIBtn:hover {
                background:rgba(127,119,221,.12);
                color:#AFA9EC;
            }

            #QapBody {
                flex:1;
                overflow-y:auto;
                padding:8px;
                scroll-behavior:smooth;
                background:#0D0B14;
            }

            #QapBody::-webkit-scrollbar        { width:2px; }
            #QapBody::-webkit-scrollbar-thumb  {
                background:rgba(127,119,221,.28);
                border-radius:999px;
            }

            #QapQBox {
                padding:8px 9px;
                background:rgba(38,33,92,.4);
                border-radius:0 8px 8px 8px;
                border-left:2px solid #534AB7;
                margin-bottom:8px;
            }

            #QapQLabel {
                font-size:8px;
                font-weight:800;
                letter-spacing:.1em;
                color:#7F77DD;
                text-transform:uppercase;
                margin-bottom:3px;
            }

            #QapQText {
                font-size:10px;
                color:#C4C0E8;
                line-height:1.45;
            }

            #QapAnswerList {
                display:flex;
                flex-direction:column;
                gap:5px;
            }

            .QapRow {
                display:flex;
                align-items:center;
                gap:7px;
                padding:6px 7px;
                border-radius:8px;
                border:1px solid rgba(127,119,221,.1);
                background:rgba(20,17,38,.7);
                transition:.12s;
                animation:QapRow .18s ease both;
            }

            .QapRow:hover {
                background:rgba(38,33,92,.3);
                border-color:rgba(127,119,221,.18);
            }

            .QapRow.QapCorrect {
                background:rgba(83,74,183,.14);
                border-color:#7F77DD;
                animation:
                    QapRow .18s ease both,
                    QapGlow 2s ease infinite;
            }

            .QapBadge {
                width:22px;
                height:22px;
                flex-shrink:0;
                border-radius:6px;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:9px;
                font-weight:700;
                background:rgba(30,24,58,.9);
                color:#6B6890;
                border:1px solid rgba(127,119,221,.15);
            }

            .QapRow.QapCorrect .QapBadge {
                background:#534AB7;
                color:#E8E6FF;
                border-color:#7F77DD;
            }

            .QapText {
                flex:1;
                font-size:10px;
                color:#9B98B8;
                line-height:1.35;
            }

            .QapRow.QapCorrect .QapText {
                color:#D4D1F5;
                font-weight:600;
            }

            .QapIcon {
                width:14px;
                height:14px;
                flex-shrink:0;
                border-radius:50%;
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:7px;
                font-weight:800;
            }

            .QapIcon.ok  { background:#534AB7; color:#E8E6FF; }
            .QapIcon.err { background:rgba(30,24,58,.9); color:#3C3862; }

            #QapAutoBtn {
                display:flex;
                align-items:center;
                justify-content:center;
                gap:6px;
                width:100%;
                margin-top:8px;
                padding:7px 0;
                border-radius:8px;
                border:1px solid rgba(127,119,221,.35);
                background:linear-gradient(135deg, #2E2660, #534AB7);
                color:#E8E6FF;
                font-size:10px;
                font-weight:700;
                text-transform:uppercase;
                cursor:pointer;
                transition:.15s;
            }

            #QapAutoBtn:hover { background:linear-gradient(135deg, #3C3489, #7F77DD); }

            #QapAutoBtn.QapAutoOn {
                background:rgba(20,17,38,.9);
                color:#AFA9EC;
            }

            #QapSpinner {
                width:10px;
                height:10px;
                border:2px solid rgba(175,169,236,.22);
                border-top-color:#AFA9EC;
                border-radius:50%;
                animation:QapSpin .7s linear infinite;
                display:none;
            }

            #QapAutoBtn.QapAutoOn #QapSpinner { display:block; }

            #QapAutoStatus {
                font-size:9px;
                color:#6B6890;
                text-align:center;
                margin-top:5px;
                height:12px;
            }

            #QapAutoStatus.active { color:#7F77DD; }

            #QapFooter {
                display:flex;
                align-items:center;
                justify-content:space-between;
                padding:7px 8px;
                border-top:1px solid rgba(127,119,221,.08);
                background:rgba(18,15,30,.95);
                gap:5px;
            }

            .QapNavBtn {
                padding:4px 8px;
                border-radius:6px;
                border:1px solid rgba(127,119,221,.18);
                background:rgba(30,24,58,.55);
                font-size:9px;
                font-weight:600;
                color:#7F77DD;
                cursor:pointer;
                transition:.12s;
            }

            .QapNavBtn:hover:not(:disabled) {
                background:rgba(83,74,183,.18);
                color:#AFA9EC;
            }

            .QapNavBtn:disabled {
                opacity:.22;
                cursor:default;
            }

            #QapProgressWrap {
                flex:1;
                display:flex;
                flex-direction:column;
                align-items:center;
                gap:2px;
            }

            #QapCounter {
                font-size:9px;
                color:#4E4B6A;
                font-weight:600;
            }

            #QapTrack {
                width:100%;
                height:2px;
                background:rgba(127,119,221,.08);
                border-radius:999px;
                overflow:hidden;
            }

            #QapBar {
                height:100%;
                background:linear-gradient(90deg, #26215C, #7F77DD, #AFA9EC);
                background-size:200% auto;
                animation:QapShimmer 3s linear infinite;
                border-radius:999px;
                transition:width .28s ease;
            }
        `;
        document.head.appendChild(StyleEl);

        const Root  = document.createElement('div');
        Root.id     = 'QapRoot';
        Root.innerHTML = `
            <div id="QapTopBar"></div>
            <div id="QapHeader">
                <div id="QapHL">
                    <div id="QapDot"></div>
                    <span id="QapTitle">Gabarito</span>
                    <span id="QapBadge">${Questions.length} questão(ões)</span>
                </div>
                <div id="QapHR">
                    <button class="QapIBtn" id="QapMinBtn" title="Minimizar">─</button>
                    <button class="QapIBtn" id="QapCloseBtn" title="Fechar">✕</button>
                </div>
            </div>
            <div id="QapBody">
                <div id="QapQBox">
                    <div id="QapQLabel">Enunciado</div>
                    <div id="QapQText">Carregando...</div>
                </div>
                <div id="QapAnswerList"></div>
                <button id="QapAutoBtn">
                    <div id="QapSpinner"></div>
                    <span id="QapAutoLabel">▶ Auto responder</span>
                </button>
                <div id="QapAutoStatus"></div>
            </div>
            <div id="QapFooter">
                <button class="QapNavBtn" id="QapPrev">← Anterior</button>
                <div id="QapProgressWrap">
                    <span id="QapCounter">–</span>
                    <div id="QapTrack"><div id="QapBar" style="width:0%"></div></div>
                </div>
                <button class="QapNavBtn" id="QapNext">Próxima →</button>
            </div>
        `;
        document.body.appendChild(Root);

        function DetectPageAlternative() {
            const Q = Questions[CurrentIndex];
            if (!Q) return null;

            const CorrectAnswer = Q.answers.find(A => A.fraction === 1 || A.fraction > 0);
            if (!CorrectAnswer) return null;

            const CorrectText = Clean(CorrectAnswer.text).toLowerCase().trim();

            const Cards = Array.from(
                document.querySelectorAll(
                    '[data-slot="card"], [class*="card"], [role="radio"], [role="option"]'
                )
            ).filter(El => El.id !== 'QapRoot' && !El.closest('#QapRoot'));

            for (const Card of Cards) {
                const CardText = Card.innerText?.toLowerCase().trim() ?? '';
                if (CardText && CorrectText && CardText.includes(CorrectText.slice(0, 15))) {
                    return Card;
                }
            }

            const AllClickables = Array.from(
                document.querySelectorAll(
                    'button, [class*="option"], [class*="alternative"], [class*="answer"], [class*="choice"], label'
                )
            ).filter(El => !El.closest('#QapRoot'));

            for (const El of AllClickables) {
                const ElText = El.innerText?.toLowerCase().trim() ?? '';
                if (ElText && CorrectText && ElText.includes(CorrectText.slice(0, 12))) {
                    return El;
                }
            }

            return null;
        }

        function HighlightDetected(El) {
            document.querySelectorAll('[data-qap-highlight]').forEach(P => {
                P.style.outline    = P.dataset.qapOldOutline ?? '';
                P.style.boxShadow  = P.dataset.qapOldShadow  ?? '';
                P.style.transition = '';
                delete P.dataset.qapHighlight;
                delete P.dataset.qapOldOutline;
                delete P.dataset.qapOldShadow;
            });

            if (!El) return;

            El.dataset.qapHighlight  = '1';
            El.dataset.qapOldOutline = El.style.outline    ?? '';
            El.dataset.qapOldShadow  = El.style.boxShadow  ?? '';
            El.style.transition      = 'outline 0.25s, box-shadow 0.25s';
            El.style.outline         = '2.5px solid #7F77DD';
            El.style.boxShadow       = '0 0 0 5px rgba(83,74,183,0.22), 0 0 24px rgba(127,119,221,0.3)';
            El.scrollIntoView({ behavior:'smooth', block:'center' });
        }

        function SetStatus(Msg, IsActive = false) {
            const El = document.getElementById('QapAutoStatus');
            if (!El) return;
            El.textContent = Msg;
            El.className   = IsActive ? 'active' : '';
        }

        function RenderQuestion(Index) {
            const Q       = Questions[Index];
            const QText   = document.getElementById('QapQText');
            const List    = document.getElementById('QapAnswerList');
            const Counter = document.getElementById('QapCounter');
            const Bar     = document.getElementById('QapBar');
            const BtnPrev = document.getElementById('QapPrev');
            const BtnNext = document.getElementById('QapNext');

            if (!Q) {
                QText.textContent   = 'Nenhuma questão encontrada.';
                List.innerHTML      = '';
                Counter.textContent = '0 / 0';
                Bar.style.width     = '0%';
                BtnPrev.disabled    = true;
                BtnNext.disabled    = true;
                return;
            }

            QText.textContent   = Clean(Q.text) || `Questão ID: ${Q.id}`;
            Counter.textContent = `${Index + 1} / ${Questions.length}`;
            Bar.style.width     = `${Math.round(((Index + 1) / Questions.length) * 100)}%`;
            BtnPrev.disabled    = Index === 0;
            BtnNext.disabled    = Index === Questions.length - 1;

            List.innerHTML = '';

            Q.answers.forEach((Answer, Idx) => {
                const IsCorrect = Answer.fraction === 1 || Answer.fraction > 0;
                const Label     = Labels[Idx] ?? String(Idx + 1);

                const Row = document.createElement('div');
                Row.className            = `QapRow${IsCorrect ? ' QapCorrect' : ''}`;
                Row.style.animationDelay = `${Idx * 50}ms`;

                const BadgeEl       = document.createElement('div');
                BadgeEl.className   = 'QapBadge';
                BadgeEl.textContent = Label;

                const TextEl       = document.createElement('span');
                TextEl.className   = 'QapText';
                TextEl.textContent = Clean(Answer.text);

                const IconEl       = document.createElement('div');
                IconEl.className   = `QapIcon ${IsCorrect ? 'ok' : 'err'}`;
                IconEl.textContent = IsCorrect ? '✓' : '✗';

                Row.appendChild(BadgeEl);
                Row.appendChild(TextEl);
                Row.appendChild(IconEl);
                List.appendChild(Row);
            });

            const Target = DetectPageAlternative();
            HighlightDetected(Target);
            SetStatus(Target ? '◈ Alternativa detectada na página' : '', !!Target);
        }

        function ClickCorrectAnswer() {
            const Target = DetectPageAlternative();
            if (Target) {
                HighlightDetected(Target);
                setTimeout(() => { Target.click(); }, 180);
                return true;
            }
            return false;
        }

        function AdvanceQuestion() {
            const BtnNext = document.getElementById('QapNext');
            if (!BtnNext || BtnNext.disabled) {
                StopAuto();
                SetStatus('◈ Todas as questões respondidas!', true);
                return false;
            }

            const PageNextCandidates = Array.from(
                document.querySelectorAll(
                    'button, [class*="next"], [class*="submit"], [class*="confirm"]'
                )
            ).filter(El => {
                if (El.closest('#QapRoot')) return false;
                const Txt = El.innerText?.toLowerCase() ?? '';
                return Txt.includes('próxim')   ||
                       Txt.includes('avanç')    ||
                       Txt.includes('continuar') ||
                       Txt.includes('next');
            });

            if (PageNextCandidates.length) PageNextCandidates[0].click();

            Navigate(1);
            return true;
        }

        function StartAuto() {
            if (AutoRunning) return;
            AutoRunning = true;

            const Btn   = document.getElementById('QapAutoBtn');
            const Label = document.getElementById('QapAutoLabel');
            Btn.classList.add('QapAutoOn');
            Label.textContent = '■ Parar auto responder';
            SetStatus('Iniciando...', true);

            function Step() {
                if (!AutoRunning) return;
                const Clicked = ClickCorrectAnswer();
                SetStatus(Clicked ? '↳ Respondendo...' : '⚠ Não detectado, avançando...', true);
                AutoInterval = setTimeout(() => {
                    if (!AutoRunning) return;
                    const HasNext = AdvanceQuestion();
                    if (HasNext) AutoInterval = setTimeout(Step, AutoDelay * 0.6);
                }, AutoDelay);
            }

            Step();
        }

        function StopAuto() {
            AutoRunning = false;
            clearTimeout(AutoInterval);
            const Btn   = document.getElementById('QapAutoBtn');
            const Label = document.getElementById('QapAutoLabel');
            if (Btn)   Btn.classList.remove('QapAutoOn');
            if (Label) Label.textContent = '▶ Auto responder';
            SetStatus('');
        }

        document.getElementById('QapAutoBtn').addEventListener('click', () => {
            if (AutoRunning) StopAuto();
            else             StartAuto();
        });

        function Navigate(Dir) {
            const Next = CurrentIndex + Dir;
            if (Next < 0 || Next >= Questions.length) return;
            CurrentIndex = Next;
            RenderQuestion(CurrentIndex);
        }

        document.getElementById('QapPrev').addEventListener('click', () => Navigate(-1));
        document.getElementById('QapNext').addEventListener('click', () => Navigate(1));

        let Minimized = false;
        document.getElementById('QapMinBtn').addEventListener('click', () => {
            Minimized = !Minimized;
            const Body   = document.getElementById('QapBody');
            const Footer = document.getElementById('QapFooter');
            const Btn    = document.getElementById('QapMinBtn');
            Body.style.display   = Minimized ? 'none' : '';
            Footer.style.display = Minimized ? 'none' : '';
            Btn.textContent      = Minimized ? '□' : '─';
        });

        document.getElementById('QapCloseBtn').addEventListener('click', () => {
            StopAuto();
            HighlightDetected(null);
            Root.classList.add('QapClosing');
            setTimeout(() => {
                Root.remove();
                StyleEl.remove();
            }, 220);
        });

        const Header = document.getElementById('QapHeader');
        let   DragOn = false;
        let DragOffX = 0;
        let DragOffY = 0;

        Header.addEventListener('mousedown', (Ev) => {
            if (Ev.target.closest('.QapIBtn')) return;
            DragOn   = true;
            DragOffX = Ev.clientX - Root.getBoundingClientRect().left;
            DragOffY = Ev.clientY - Root.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });

        document.addEventListener('mousemove', (Ev) => {
            if (!DragOn) return;
            Root.style.right  = 'auto';
            Root.style.bottom = 'auto';
            Root.style.left   = `${Ev.clientX - DragOffX}px`;
            Root.style.top    = `${Ev.clientY - DragOffY}px`;
        });

        document.addEventListener('mouseup', () => {
            DragOn                         = false;
            document.body.style.userSelect = '';
        });

        document.addEventListener('keydown', (Ev) => {
            if (!document.getElementById('QapRoot')) return;
            if (Ev.key === 'ArrowRight' || Ev.key === 'ArrowDown') Navigate(1);
            if (Ev.key === 'ArrowLeft'  || Ev.key === 'ArrowUp')   Navigate(-1);
        });

        RenderQuestion(0);

        if (!Found || !Found.length) {
            console.warn('⚠️ Panel: nenhuma questão encontrada.');
        } else {
            console.log(`✅ Panel: ${Questions.length} questões carregadas.`);
        }
    }
})();