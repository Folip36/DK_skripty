/*
 * Script Name: Single Village Planner
 * Version: v2.1.2
 * Last Updated: 2025-07-02
 * Author: RedAlert
 * Author URL: https://twscripts.dev/
 * Author Contact: redalert_tw (Discord)
 * Approved: t14559753
 * Approved Date: 2021-02-11
 * Mod: JawJaw, Gemini
 */

/*--------------------------------------------------------------------------------------
 * This script can NOT be cloned and modified without permission from the script author.
 --------------------------------------------------------------------------------------*/

var scriptData = {
    name: 'Single Village Planner',
    version: 'v2.1.2', // Updated version
    author: 'RedAlert',
    authorUrl: 'https://twscripts.dev/',
    helpLink:
        'https://forum.tribalwars.net/index.php?threads/single-village-planner.286667/',
};

// User Input
if (typeof DEBUG !== 'boolean') DEBUG = false;

// Constants
var LS_PREFIX = 'raSingleVillagePlanner';
var TIME_INTERVAL = 60 * 60 * 1000 * 24 * 365; // unit info does not change during the whole world duration so we only need to get it once
var GROUP_ID = localStorage.getItem(`${LS_PREFIX}_chosen_group`) ?? 0;
var LAST_UPDATED_TIME = localStorage.getItem(`${LS_PREFIX}_last_updated`) ?? 0;

// Globals
var unitInfo,
    troopCounts = [];

// Translations
var translations = {
    en_DK: {
        'Single Village Planner': 'Single Village Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'This script can only be run on a single village screen!',
        Village: 'Village',
        'Calculate Launch Times': 'Calculate Launch Times',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Launch times are being calculated ...',
        'Missing user input!': 'Missing user input!',
        'Landing Time': 'Landing Time',
        'This village has no unit selected!':
            'This village has no unit selected!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Export Plan as BB Code',
        'Plan for:': 'Plan for:',
        'Landing Time:': 'Landing Time:',
        Unit: 'Unit',
        'Attack Type': 'Attack Type', // Added translation for Attack Type
        'Launch Time': 'Launch Time',
        Command: 'Command',
        Status: 'Status',
        Send: 'Send',
        From: 'From',
        Priority: 'Priority',
        'Early send': 'Early send',
        'Landing time was updated!': 'Landing time was updated!',
        'Error fetching village groups!': 'Error fetching village groups!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    sk_SK: {
        'Single Village Planner': 'Plánovač pre jednu dedinu',
        Help: 'Pomoc',
        'This script can only be run on a single village screen!':
            'Tento skript sa dá spustiť iba v náhľade dediny z mapy',
        Village: 'Dedina',
        'Calculate Launch Times': 'Výpočet časov odoslania',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Časy odoslania sa vypočítavajú ...',
        'Missing user input!': 'Chýba označenie jednotiek!',
        'Landing Time': 'Čas dopadu',
        'This village has no unit selected!':
            'Táto dedina nemá označenú jednotku!',
        'Prio.': 'Prio.',
        'No possible combinations found!':
            'Žiadne možné kombinácie sa nenašli!',
        'Export Plan as BB Code': 'Exportovať Plán ako BB Kódy',
        'Plan for:': 'Plán pre:',
        'Landing Time:': 'Čas dopadu:',
        Unit: 'Jednotka',
        'Attack Type': 'Typ útoku', // Added translation for Attack Type
        'Launch Time': 'Čas odoslania:',
        Command: 'Príkaz',
        Status: 'Stav',
        Send: 'Odoslať',
        From: 'Z',
        Priority: 'Priorita',
        'Early send': 'Skoré odoslanie',
        'Landing time was updated!': 'Čas dopadu aktualizovaný!',
        'Error fetching village groups!': 'Chyba pri načítaní skupiny dedín',
        'Dist.': 'Vzdialenosť',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group!',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    nl_NL: {
        'Single Village Planner': 'Enkel Dorp Planner',
        Help: 'Help',
        'This script can only be run on a single village screen!':
            'Het script kan enkel worden uitgevoerd op het dorpsoverzicht via de kaart!',
        Village: 'Dorp',
        'Calculate Launch Times': 'Bereken verzendtijden',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Verzendtijden worden berekend ...',
        'Missing user input!': 'Mis spelersinvoer!',
        'Landing Time': 'Landingstijd',
        'This village has no unit selected!':
            'Dit dorp heeft geen troepen geselecteerd!',
        'Prio.': 'Prioriteit.',
        'No possible combinations found!': 'Geen mogelijkheden gevonden!',
        'Export Plan as BB Code': 'Exporteer plan als BB Code',
        'Plan for:': 'Plan voor:',
        'Landing Time:': 'Landingstijd:',
        Unit: 'Eenheid',
        'Attack Type': 'Aanvalstype', // Added translation for Attack Type
        'Launch Time': 'Verzendtijd',
        Command: 'Bevel',
        Status: 'Status',
        Send: 'Zend',
        From: 'Van',
        Priority: 'Prioriteit',
        'Early send': 'Vroeg verzenden',
        'Landing time was updated!': 'Aankomsttijd is geupdate!',
        'Error fetching village groups!':
            'Fout met ophalen van dorpen uit groep!',
        'Dist.': 'Afstand',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    el_GR: {
        'Single Village Planner': 'Ατομιακό Πλάνο Χωριού',
        Help: 'Βοήθεια',
        'This script can only be run on a single village screen!':
            'Αυτο το Script τρέχει απο Πληροφορίες Χωριού!',
        Village: 'Χωριό',
        'Calculate Launch Times': 'Υπολόγισε Ώρα Εκκίνησης',
        Reset: 'Επαναφορά',
        'Launch times are being calculated ...':
            'ώρες εκκίνησης υπολογίζονται ...',
        'Missing user input!': 'Λείπουν τα δεδομένα!',
        'Landing Time': 'Ώρα άφιξης',
        'This village has no unit selected!':
            'Το χωριό δεν έχει επιλεγμένες μονάδες!',
        'Prio.': 'Προτ.',
        'No possible combinations found!': 'No possible combinations found!',
        'Export Plan as BB Code': 'Εξαγωγή πλάνου σε BB Code',
        'Plan for:': 'Πλάνο για:',
        'Landing Time:': 'Ώρα άφιξης:',
        Unit: 'Μονάδα',
        'Attack Type': 'Τύπος Επίθεσης', // Added translation for Attack Type
        'Launch Time': 'Ώρα εκκίνησης',
        Command: 'Εντολή',
        Status: 'Κατάσταση',
        Send: 'Στείλε',
        From: 'Από',
        Priority: 'Προτεραιότητα',
        'Early send': 'Στάλθηκαν Νωρίτερα',
        'Landing time was updated!': 'Η ώρα άφιξης ανανεώθηκε!',
        'Error fetching village groups!':
            'Σφάλμα κατά την ανάκτηση ομάδων χωριών!',
        'Dist.': 'Απόσταση',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    it_IT: {
        'Single Village Planner': 'Planner Singolo Villo',
        Help: 'Aiuto',
        'This script can only be run on a single village screen!':
            'Questo script può essere lanciato solo dalla panoramica del villaggio!',
        Village: 'Villaggio',
        Coords: 'Coordinate',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcola tempi di lancio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'I tempi di lancio sono stati calcolati ...',
        'Missing user input!': 'Manca selezione truppe!',
        'Landing Time': 'Tempo di arrivo',
        'This village has no unit selected!':
            'Questo villaggio non ha le unità selezionate!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Nessuna combinazione possibile!',
        'Export Plan as BB Code': 'Esporta il plan in BB code',
        'Plan for:': 'Plan per:',
        'Landing Time:': 'Tempo di arrivo:',
        Unit: 'Unità',
        'Attack Type': 'Tipo di Attacco', // Added translation for Attack Type
        'Launch Time': 'Tempo di lancio',
        Command: 'Comando',
        Status: 'Status',
        Send: 'Invia',
        From: 'Da',
        Priority: 'Priorità',
        'Early send': 'Anticipa invio',
        'Landing time was updated!': 'Il tempo di arrivo è stato aggiornato!',
        'Error fetching village groups!': 'Errore nel recupero gruppo!',
        Group: 'Gruppo',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    tr_TR: {
        'Single Village Planner': 'Tek Köy Planlayıcısı',
        Help: 'Yardım',
        'This script can only be run on a single village screen!':
            'Bu komut dosyası yalnızca tek bir köy ekranında çalıştırılabilir',
        Village: 'Köy',
        Coords: 'Koordinat',
        Continent: 'Kıta',
        'Calculate Launch Times': 'Başlatma Sürelerini Hesaplayın',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Başlatma süreleri hesaplanıyor ...',
        'Missing user input!': 'Eksik kullanıcı girişi!',
        'Landing Time': 'İniş zamanı',
        'This village has no unit selected!': 'Bu köyde seçili birim yok!',
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Olası kombinasyon bulunamadı!',
        'Export Plan as BB Code': 'Planı BB Kodu Olarak Dışa Aktar',
        'Plan for:': 'Plan için:',
        'Landing Time:': 'İniş zamanı:',
        Unit: 'Birim',
        'Attack Type': 'Saldırı Tipi', // Added translation for Attack Type
        'Launch Time': 'Başlatma Zamanı:',
        Command: 'Komut',
        Status: 'Durum',
        Send: 'Gönder',
        From: 'Z',
        Priority: 'Öncelik',
        'Early send': 'erken gönder',
        'Landing time was updated!': 'İniş zamanı güncellendi!',
        'Error fetching village groups!':
            'Köy grupları getirilirken hata oluştu',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    pt_BR: {
        'Single Village Planner': 'Planeador para ataques em uma só aldeia',
        Help: 'Ajuda',
        'This script can only be run on a single village screen!':
            'Este script só pode ser usado na página de uma só aldeia!',
        Village: 'Aldeia',
        Coords: 'Coords',
        Continent: 'Continente',
        'Calculate Launch Times': 'Calcular tempos de envio',
        Reset: 'Reset',
        'Launch times are being calculated ...':
            'Os tempos de envio estão a ser calculados ...',
        'Missing user input!': 'Falta o input do utilizador!',
        'Landing Time': 'Tempo de chegada',
        'This village has no unit selected!':
            'Esta aldeia não tem unidades selecionadas!',
        'Prio.': 'Prioridade',
        'No possible combinations found!':
            'Não foram encontradas combinações possíveis!',
        'Export Plan as BB Code': 'Exportar plano em código BB',
        'Plan for:': 'Plano para:',
        'Landing Time:': 'Tempo de chegada:',
        Unit: 'Unidade',
        'Attack Type': 'Tipo de Ataque', // Added translation for Attack Type
        'Launch Time': 'Tempo de envio',
        Command: 'Comando',
        Status: 'Estado',
        Send: 'Send',
        From: 'From',
        Priority: 'Prioridade',
        'Early send': 'Enviar cedo',
        'Landing time was updated!': 'O tempo de chegada foi atualizado!',
        'Error fetching village groups!':
            'Erro a ir buscar os grupos de aldeias!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Villages list could not be fetched!',
        Group: 'Group',
        'Export Plan without tables': 'Export Plan without tables',
        'Chosen group was reset!': 'Chosen group was reset!',
        'Reset Chosen Group': 'Reset Chosen Group',
        'Script configuration was reset!': 'Script configuration was reset!',
    },
    fr_FR: {
        'Single Village Planner': "Planificateur d'attaque village unique",
        Help: 'Aide',
        'This script can only be run on a single village screen!':
            "Ce script doit être lancé depuis la vu d'un village!",
        Village: 'Village',
        'Calculate Launch Times': "Calcul heure d'envoi",
        Reset: 'Réinitialiser',
        'Launch times are being calculated ...':
            "Heures d'envoi en cours de calcul ...",
        'Missing user input!': 'Aucun joueur renseigné!',
        'Landing Time': "Heure d'arrivé",
        'This village has no unit selected!':
            "Ce village n'a aucune unité sélectionnée!",
        'Prio.': 'Prio.',
        'No possible combinations found!': 'Aucune combinaison possible!',
        'Export Plan as BB Code': "Exporter le plan d'attaque en bb-code",
        'Plan for:': 'Plan pour:',
        'Landing Time:': "Heure d'arrivé:",
        Unit: 'Unité',
        'Attack Type': "Type d'attaque", // Added translation for Attack Type
        'Launch Time': "Heure d'envoi",
        Command: 'Ordre',
        Status: 'Status',
        Send: 'Envoyer',
        From: 'Origine',
        Priority: 'Priorité',
        'Early send': 'Envoi tôt',
        'Landing time was updated!': "Heure d'arrivé mis à jour!",
        'Error fetching village groups!':
            'Erreur lors de la récupération des groupes de villages!',
        'Dist.': 'Dist.',
        'Villages list could not be fetched!':
            'Impossible de récupérer la liste des villages!',
        Group: 'Groupe',
        'Export Plan without tables': 'Exporter le plan sans tableau',
        'Chosen group was reset!': 'Groupe sélectionné réinitialisé!',
        'Reset Chosen Group': 'Réinitialiser groupe(s) sélectionnée(s)',
        'Script configuration was reset!': 'Configuration réinitialisée!',
    },
};

// Helper: Determines the attack type based on the unit
// This function now provides the default value for the dropdown.
function getDefaultAttackType(unit) {
    if (unit === 'spy') {
        return 'Fake';
    } else if (unit === 'snob') {
        return 'vlak';
    } else {
        return 'Full';
    }
}

// Custom Attack Types
const CUSTOM_ATTACK_TYPES = ['Full', 'Fake', 'vlak', 'rozložený vlak'];

// Init Debug
initDebug();

// Fetch unit config only when needed
if (LAST_UPDATED_TIME !== null) {
    if (Date.parse(new Date()) >= LAST_UPDATED_TIME + TIME_INTERVAL) {
        fetchUnitInfo();
    } else {
        unitInfo = JSON.parse(localStorage.getItem(`${LS_PREFIX}_unit_info`));
    }
} else {
    fetchUnitInfo();
}

// Initialize Attack Planner
async function initAttackPlanner(groupId) {
    // run on script load
    const groups = await fetchVillageGroups();
    troopCounts = await fetchTroopsForCurrentGroup(groupId);
    let villages = await fetchAllPlayerVillagesByGroup(groupId);

    const destinationVillage = jQuery(
        '#content_value table table td:eq(2)'
    ).text();
    villages = villages.map((item) => {
        const distance = calculateDistance(item.coords, destinationVillage);
        return {
            ...item,
            distance: parseFloat(distance.toFixed(2)),
        };
    });
    villages = villages.sort((a, b) => {
        return a.distance - b.distance;
    });
    const content = prepareContent(villages, groups);
    renderUI(content);

    // after script has been loaded events
    setTimeout(function () {
        // set a default landing time
        const today = new Date().toLocaleString('en-GB').replace(',', '');
        jQuery('#raLandingTime').val(today);

        // handle non-archer worlds
        if (!game_data.units.includes('archer')) {
            jQuery('.archer-world').hide();
        }

        // handle non-paladin worlds
        if (!game_data.units.includes('knight')) {
            jQuery('.paladin-world').hide();
        }

        // Set initial values for attack type inputs based on previous selection or default
        jQuery('#villagesTable').find('.village-item').each(function() {
            const selectedUnit = jQuery(this).find('.ra-selected-unit').attr('data-unit');
            const attackTypeSelect = jQuery(this).find('.ra-attack-type-select');
            if (selectedUnit) {
                attackTypeSelect.val(getDefaultAttackType(selectedUnit));
            }
        });

    }, 100);
    // scroll to element to focus user's attention
    jQuery('html,body').animate(
        { scrollTop: jQuery('#raSingleVillagePlanner').offset().top - 8 },
        'slow'
    );
    // action handlers
    choseUnit();
    changeVillagePriority();
    calculateLaunchTimes();
    resetAll();
    fillLandingTimeFromCommand();
    filterVillagesByChosenGroup();
    setAllUnits();
    resetGroup();
}

// Helper: Prepare UI
function prepareContent(villages, groups) {
    const villagesTable = renderVillagesTable(villages);
    const groupsFilter = renderGroupsFilter(groups);
    return `
        <div class="ra-mb15">
            <div class="ra-grid">
                <div>
                    <label for="raLandingTime">
                        ${tt('Landing Time')} (dd/mm/yyyy HH:mm:ss)
                    </label>
                    <input id="raLandingTime" type="text" value="" />
                </div>
                <div>
                    <label>${tt('Group')}</label>
                    ${groupsFilter}
                </div>
            </div>
        </div>
        <div class="ra-mb15">
            ${villagesTable}
        </div>
        <div class="ra-mb15">
            <a href="javascript:void(0);"
                id="calculateLaunchTimes"
                class="btn btn-confirm-yes"
            >
                ${tt('Calculate Launch Times')}
            </a>
            <a href="javascript:void(0);" id="resetAll" class="btn btn-confirm-no">
                ${tt('Reset')}
            </a>
            <a href="javascript:void(0);"
                id="resetGroupBtn"
                class="btn"
            >
                ${tt('Reset Chosen Group')}
            </a>
        </div>
        <div style="display:none;" class="ra-mb-15" id="raVillagePlanner">
            <div class="ra-mb15">
                <label for="raExportPlanBBCode">${tt('Export Plan as BB Code')}</label>
                <textarea id="raExportPlanBBCode" readonly></textarea>
            </div>
            <div>
                <label for="raExportPlanCode">${tt('Export Plan without tables')}</label>
                <textarea id="raExportPlanCode" readonly></textarea>
            </div>
        </div>
    `;
}

// Render UI
function renderUI(body) {
    const content = `
        <div class="ra-single-village-planner" id="raSingleVillagePlanner">
            <h2>${tt(scriptData.name)}</h2>
            <div class="ra-single-village-planner-data">
                ${body}
            </div>
            <br>
            <small>
                <strong>
                    ${tt(scriptData.name)} ${scriptData.version}
                </strong>
                -
                <a href="${ scriptData.authorUrl }" target="_blank" rel="noreferrer noopener">
                    ${scriptData.author}
                </a>
                -
                <a href="${ scriptData.helpLink }" target="_blank" rel="noreferrer noopener">
                    ${tt('Help')}
                </a>
            </small>
        </div>
        <style>
            .ra-single-village-planner {
                position: relative;
                display: block;
                width: auto;
                height: auto;
                clear: both;
                margin: 0 auto 15px;
                padding: 10px;
                border: 1px solid #603000;
                box-sizing: border-box;
                background: #f4e4bc;
            }

            .ra-single-village-planner * {
                box-sizing: border-box;
            }

            .ra-single-village-planner input[type="text"] {
                width: 100%;
                padding: 5px 10px;
                border: 1px solid #000;
                font-size: 16px;
                line-height: 1;
            }

            .ra-single-village-planner label {
                font-weight: 600 !important;
                margin-bottom: 5px;
                display: block;
            }

            .ra-single-village-planner select {
                width: 100%;
                padding: 5px 10px;
                border: 1px solid #000;
                font-size: 16px;
                line-height: 1;
            }

            .ra-single-village-planner textarea {
                width: 100%;
                height: 100px;
                resize: none;
                padding: 5px 10px;
            }

            .ra-single-village-planner .ra-grid {
                display: grid;
                grid-template-columns: 1fr 150px;
                grid-gap: 0 20px;
            }

            .ra-table {
                border-collapse: separate !important;
                border-spacing: 2px !important;
            }

            .ra-table tbody tr:hover td {
                background-color: #ffdd30 !important;
            }

            .ra-table tbody tr.ra-selected-village td {
                background-color: #ffe563 !important;
            }

            .ra-table th {
                font-size: 14px;
            }

            .ra-table th, .ra-table td {
                padding: 4px;
                text-align: center;
            }

            .ra-table td a {
                word-break: break-all;
            }

            .ra-table tr:nth-of-type(2n+1) td {
                background-color: #fff5da;
            }

            .ra-table td img {
                padding: 2px;
                border: 2px solid transparent;
                cursor: pointer;
            }

            .ra-table td img.ra-selected-unit {
                border: 2px solid #ff0000;
            }

            .ra-table a:focus {
                color: blue;
            }

            .ra-table th .icon {
                transform: scale(1.05);
                margin: 0;
            }

            .ra-table th img {
                cursor: pointer;
            }

            .ra-table th.ra-unit-toggle:hover {
                background-color: rgba(97, 48, 0, 0.6) !important;
                background-image: none !important;
                cursor: pointer !important;
            }

            .ra-table td .icon {
                filter: grayscale(100%);
                transform: scale(1.05);
                margin: 0;
                cursor: pointer;
            }

            .ra-table td .icon.ra-priority-village {
                filter: none !important;
            }

            .ra-table td span {
                transform: scale(1.05);
                margin: 0;
                cursor: pointer;
                display: inline-block;
            }
            .ra-mb15 { margin-bottom: 15px; }
            .ra-mb-15 { margin-bottom: -15px; }
            .ra-attack-type-select { width: 100px; text-align: center; }
        </style>
    `;
    jQuery('#content_value').html(content);
}

// Helper: Renders village table
function renderVillagesTable(villages) {
    let attackTypeOptions = '';
    CUSTOM_ATTACK_TYPES.forEach(type => {
        attackTypeOptions += `<option value="${type}">${type}</option>`;
    });

    let table = `
        <table class="ra-table vis" width="100%">
            <thead>
                <tr>
                    <th width="10">${tt('Prio.')}</th>
                    <th width="10%">${tt('Village')}</th>
                    <th>${tt('Dist.')}</th>
                    <th width="auto">${tt('Attack Type')}</th> <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('spear')}"
                            data-unit="spear" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('sword')}"
                            data-unit="sword" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('axe')}"
                            data-unit="axe" class="unit-img" />
                    </th>
                    <th width="10%" class="archer-world">
                        <img src="${game_data.players[game_data.player.id].unit_image('archer')}"
                            data-unit="archer" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('spy')}"
                            data-unit="spy" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('light')}"
                            data-unit="light" class="unit-img" />
                    </th>
                    <th width="10%" class="archer-world">
                        <img src="${game_data.players[game_data.player.id].unit_image('marcher')}"
                            data-unit="marcher" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('heavy')}"
                            data-unit="heavy" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('ram')}"
                            data-unit="ram" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('catapult')}"
                            data-unit="catapult" class="unit-img" />
                    </th>
                    <th width="10%" class="paladin-world">
                        <img src="${game_data.players[game_data.player.id].unit_image('knight')}"
                            data-unit="knight" class="unit-img" />
                    </th>
                    <th width="10%">
                        <img src="${game_data.players[game_data.player.id].unit_image('snob')}"
                            data-unit="snob" class="unit-img" />
                    </th>
                </tr>
            </thead>
            <tbody id="villagesTable">`;
    villages.forEach((village) => {
        const units = game_data.units;
        let unitsTd = '';
        units.forEach((unit) => {
            if (unit === 'militia') return;
            let hiddenClass = '';
            if (unit === 'archer' && !game_data.units.includes('archer')) {
                hiddenClass = 'archer-world';
            }
            if (unit === 'marcher' && !game_data.units.includes('archer')) {
                hiddenClass = 'archer-world';
            }
            if (unit === 'knight' && !game_data.units.includes('knight')) {
                hiddenClass = 'paladin-world';
            }
            unitsTd += `
                <td class="${hiddenClass}">
                    <img src="${game_data.players[game_data.player.id].unit_image(unit)}"
                        data-village-id="${village.id}"
                        data-unit="${unit}"
                        data-distance="${village.distance}"
                        class="unit-chooser"
                        title="${unitInfo[unit].name} (${troopCounts[village.id][unit]})"
                    />
                </td>
            `;
        });

        table += `
            <tr class="village-item" data-village-id="${village.id}">
                <td>
                    <span class="icon ally no-arrow ra-priority-village" data-village-id="${village.id}"></span>
                </td>
                <td>
                    <a href="/game.php?screen=info_village&id=${village.id}" target="_blank" rel="noreferrer noopener">
                        ${village.name} (${village.coords})
                    </a>
                </td>
                <td>${village.distance}</td>
                <td>
                    <select class="ra-attack-type-select" data-village-id="${village.id}">
                        ${attackTypeOptions}
                    </select>
                </td> ${unitsTd}
            </tr>
        `;
    });
    table += `
            </tbody>
        </table>
    `;

    return table;
}

// Helper: Renders village group filters
function renderGroupsFilter(groups) {
    let options = '';
    if (groups.length) {
        groups.forEach((group) => {
            options += `<option value="${group.id}">${group.name}</option>`;
        });
    }

    const groupsFilter = `
        <select id="raVillageGroups">
            <option value="0">${tt('All villages')}</option>
            ${options}
        </select>
    `;

    return groupsFilter;
}

// Helper: Event listener for choosing unit
function choseUnit() {
    jQuery('#villagesTable').on('click', '.unit-chooser', function (e) {
        e.preventDefault();

        const villageRow = jQuery(this).closest('tr');
        const attackTypeSelect = villageRow.find('.ra-attack-type-select');

        villageRow
            .find('.unit-chooser')
            .removeClass('ra-selected-unit');
        jQuery(this).addClass('ra-selected-unit');

        const unit = jQuery(this).attr('data-unit');
        attackTypeSelect.val(getDefaultAttackType(unit)); // Set default attack type based on unit

        const villageId = jQuery(this).attr('data-village-id');
        villageRow.addClass('ra-selected-village');
    });
}

// Helper: Event listener for changing village priority
function changeVillagePriority() {
    jQuery('#villagesTable').on('click', '.ra-priority-village', function (e) {
        e.preventDefault();

        const villageRow = jQuery(this).closest('tr');
        const attackTypeSelect = villageRow.find('.ra-attack-type-select');

        villageRow.toggleClass('ra-selected-village');
        jQuery(this).toggleClass('active');

        // If priority is toggled off (village deselected from priority), clear unit selection and attack type
        if (!jQuery(this).hasClass('active')) {
            villageRow.find('.unit-chooser').removeClass('ra-selected-unit');
            // Reset dropdown to default or a placeholder like 'Full' if no unit is selected
            attackTypeSelect.val('Full'); 
        }
    });
}

// Helper: Event listener for calculating launch times
function calculateLaunchTimes() {
    jQuery('#calculateLaunchTimes').on('click', function (e) {
        e.preventDefault();

        UI.SuccessMessage(tt('Launch times are being calculated ...'));

        const raLandingTime = jQuery('#raLandingTime').val();
        if (!raLandingTime) {
            UI.ErrorMessage(tt('Missing user input!'));
            return;
        }

        const landingTime = Date.parse(
            formatDateForParse(raLandingTime)
        );
        const destinationVillage = jQuery(
            '#content_value table table td:eq(2)'
        ).text();

        let villagesUnitsToSend = [];
        jQuery('#villagesTable')
            .find('.ra-selected-unit')
            .each(function () {
                const villageRow = jQuery(this).closest('tr');
                const villageId = jQuery(this).attr('data-village-id');
                const unit = jQuery(this).attr('data-unit');
                const distance = jQuery(this).attr('data-distance');
                const attackType = villageRow.find('.ra-attack-type-select').val(); // Get attack type from dropdown

                let highPrio = false;
                if (
                    villageRow
                        .find('.ra-priority-village')
                        .hasClass('active')
                ) {
                    highPrio = true;
                }

                const villageCoords = jQuery(
                    `.village-item[data-village-id="${villageId}"] a`
                )
                    .text()
                    .match(/\d+\|\d+/)[0];

                villagesUnitsToSend.push({
                    id: villageId,
                    unit: unit,
                    distance: distance,
                    highPrio: highPrio,
                    coords: villageCoords,
                    attackType: attackType // Pass the selected attack type
                });
            });

        if (!villagesUnitsToSend.length) {
            UI.ErrorMessage(tt('This village has no unit selected!'));
            return;
        }

        const plans = getPlans(landingTime, destinationVillage, villagesUnitsToSend);

        let bbCodePlans = '';
        let codePlans = '';

        if (plans.length) {
            bbCodePlans = getBBCodePlans(plans, destinationVillage, landingTime);
            codePlans = getCodePlans(plans, destinationVillage, landingTime);
        } else {
            UI.ErrorMessage(tt('No possible combinations found!'));
        }

        jQuery('#raExportPlanBBCode').val(bbCodePlans);
        jQuery('#raExportPlanCode').val(codePlans);
        jQuery('#raVillagePlanner').show();
    });
}

// Helper: Prepare plans based on user input
function getPlans(landingTime, destinationVillage, villagesUnitsToSend) {
    let plans = [];

    // Prepare plans list
    villagesUnitsToSend.forEach((item) => {
        const launchTime = getLaunchTime(item.unit, landingTime, item.distance);
        // Use the attackType passed from the UI
        const attackType = item.attackType;
        const plan = {
            destination: destinationVillage,
            landingTime: landingTime,
            distance: item.distance,
            unit: item.unit,
            attackType: attackType, // Use the user-defined attack type
            highPrio: item.highPrio,
            villageId: item.id,
            launchTime: launchTime,
            coords: item.coords,
            launchTimeFormatted: formatDateTime(launchTime),
        };
        plans.push(plan);
    });

    // Sort plans by launch time
    const sortedPlans = plans.sort((a, b) => {
        if (a.highPrio && !b.highPrio) return -1;
        if (!a.highPrio && b.highPrio) return 1;
        return a.launchTime - b.launchTime;
    });

    // Filter out invalid plans
    const filteredPlans = sortedPlans.filter((plan) => !isNaN(plan.launchTime));

    return filteredPlans;
}

// Helper: Get BB Code plans
function getBBCodePlans(plans, destinationVillage, landingTime) {
    let bbCode = `[size=12][b]${tt('Plan for:')} ${destinationVillage}[/b][/size]\n`;
    bbCode += `[size=10]${tt('Landing Time:')} ${formatDateTime(landingTime)}[/size]\n\n`;
    bbCode += `[spoiler][size=9]\n`;
    bbCode += `[table]\n`;
    // Updated header to include 'Attack Type'
    bbCode += `[attr="width:10,align:center"]${tt('Prio.')},[attr="width:150,align:center"]${tt('From')},[attr="width:50,align:center"]${tt('Dist.')},[attr="width:100,align:center"]${tt('Unit')},[attr="width:100,align:center"]${tt('Attack Type')},[attr="width:150,align:center"]${tt('Launch Time')},[attr="width:auto,align:center"]${tt('Command')}\n`;

    plans.forEach((plan) => {
        const priority = plan.highPrio ? '!!!' : '';
        const launchTime = formatDateTime(plan.launchTime);
        const unitImage = `[unit]${plan.unit}[/unit]`;
        // Determine the 'type' parameter for the game URL based on attackType.
        // For custom types, the game still only understands 'attack' or 'scout'.
        // Assuming 'Fake' means 'scout' for the game URL, otherwise 'attack'.
        const commandTypeParam = (plan.attackType === 'Fake' || plan.unit === 'spy') ? 'scout' : 'attack';
        const commandUrl = `/game.php?village=${plan.villageId}&screen=place&mode=command&target=${plan.destination.match(/\d+/)[0]}&type=${commandTypeParam}&template_id=&t_all=1&unit_${plan.unit}=1`;

        bbCode += `[attr="width:10,align:center"]${priority},[attr="width:150,align:center"]${plan.coords},[attr="width:50,align:center"]${plan.distance},[attr="width:100,align:center"]${unitImage},[attr="width:100,align:center"]${plan.attackType},[attr="width:150,align:center"]${launchTime},[attr="width:auto,align:center"][url=${commandUrl}]${tt('Send')}[/url]\n`;
    });

    bbCode += `[/table]\n`;
    bbCode += `[/size][/spoiler]`;

    return bbCode;
}

// Helper: Get Code plans
function getCodePlans(plans, destinationVillage, landingTime) {
    let code = `Plan for: ${destinationVillage}\n`;
    code += `Landing Time: ${formatDateTime(landingTime)}\n\n`;

    plans.forEach((plan) => {
        const priority = plan.highPrio ? ' (Prio: YES)' : '';
        const launchTime = formatDateTime(plan.launchTime);
        // Determine the 'type' parameter for the game URL based on attackType.
        const commandTypeParam = (plan.attackType === 'Fake' || plan.unit === 'spy') ? 'scout' : 'attack';
        const commandUrl = `/game.php?village=${plan.villageId}&screen=place&mode=command&target=${plan.destination.match(/\d+/)[0]}&type=${commandTypeParam}&template_id=&t_all=1&unit_${plan.unit}=1`;

        code += `From: ${plan.coords}, Unit: ${plan.unit}, Attack Type: ${plan.attackType}, Launch Time: ${launchTime}, Command: ${commandUrl}${priority}\n`;
    });

    return code;
}

// Helper: Event listener for resetting all filters
function resetAll() {
    jQuery('#resetAll').on('click', function (e) {
        e.preventDefault();
        jQuery('#raLandingTime').val('');
        jQuery('.unit-chooser').removeClass('ra-selected-unit');
        jQuery('.village-item').removeClass('ra-selected-village');
        jQuery('.ra-priority-village').removeClass('active');
        jQuery('.ra-attack-type-select').val('Full'); // Reset dropdown to 'Full' on reset
        jQuery('#raExportPlanBBCode').val('');
        jQuery('#raExportPlanCode').val('');
        jQuery('#raVillagePlanner').hide();
        UI.SuccessMessage(tt('Script configuration was reset!'));
    });
}

// Helper: Event listener for resetting chosen group
function resetGroup() {
    jQuery('#resetGroupBtn').on('click', function (e) {
        e.preventDefault();
        localStorage.removeItem(`${LS_PREFIX}_chosen_group`);
        UI.SuccessMessage(tt('Chosen group was reset!'));
        location.reload();
    });
}

// Helper: Event listener for filling landing time from game command
function fillLandingTimeFromCommand() {
    jQuery('#command_detail_info').on('click', '#date_arrival', function (e) {
        e.preventDefault();
        const arrivalTime = jQuery(this).text().trim();
        jQuery('#raLandingTime').val(arrivalTime);
        UI.SuccessMessage(tt('Landing time was updated!'));
    });
}

// Helper: Filter villages by chosen group
function filterVillagesByChosenGroup() {
    jQuery('#raVillageGroups').on('change', async function (e) {
        e.preventDefault();
        const groupId = jQuery(this).val();
        localStorage.setItem(`${LS_PREFIX}_chosen_group`, groupId);
        await initAttackPlanner(groupId);
    });
}

// Helper: Set all units as selected for bulk
function setAllUnits() {
    jQuery('th.ra-unit-toggle').on('click', function (e) {
        e.preventDefault();
        const unit = jQuery(this).find('img').attr('data-unit');
        jQuery(`.unit-chooser[data-unit="${unit}"]`).trigger('click');
    });
}

// Helper: Get village groups from game_data
async function fetchVillageGroups() {
    try {
        const response = await jQuery.ajax({
            url: `/game.php?screen=api&ajax=groups&action=get_groups&h=${game_data.csrf}`,
            method: 'GET',
            dataType: 'json',
        });
        return response.response.groups;
    } catch (error) {
        UI.ErrorMessage(tt('Error fetching village groups!'));
        return [];
    }
}

// Helper: Get all player villages by group
async function fetchAllPlayerVillagesByGroup(groupId) {
    try {
        const response = await jQuery.ajax({
            url: `/game.php?screen=api&ajax=villages&action=get_villages_by_group&h=${game_data.csrf}`,
            method: 'GET',
            data: {
                group_id: groupId,
            },
            dataType: 'json',
        });
        return response.response.villages;
    } catch (error) {
        UI.ErrorMessage(tt('Villages list could not be fetched!'));
        return [];
    }
}

// Helper: Fetch troop counts for current group
async function fetchTroopsForCurrentGroup(groupId) {
    const villages = await fetchAllPlayerVillagesByGroup(groupId);
    const villagesTroops = {};

    for (const village of villages) {
        try {
            const response = await jQuery.ajax({
                url: `/game.php?village=${village.id}&screen=overview_villages&ajax=true&h=${game_data.csrf}`,
                method: 'GET',
                dataType: 'json',
            });

            const parser = new DOMParser();
            const doc = parser.parseFromString(response.success, 'text/html');

            const units = {};
            jQuery(doc)
                .find('.unit-item')
                .each(function () {
                    const unitName = jQuery(this)
                        .find('.unit-item-image')
                        .attr('class')
                        .match(/unit-item-image-(\w+)/)[1];
                    const unitCount = parseInt(
                        jQuery(this).find('.unit-item-amount').text().trim()
                    );
                    units[unitName] = unitCount;
                });
            villagesTroops[village.id] = units;
        } catch (error) {
            console.error(
                `${scriptInfo()} Error fetching troops for village ${village.name}:`,
                error
            );
        }
    }
    return villagesTroops;
}

// Helper: Fetch Unit Info
async function fetchUnitInfo() {
    try {
        const response = await jQuery.ajax({
            url: `/game.php?screen=info_command&ajax=units&h=${game_data.csrf}`,
            method: 'GET',
            dataType: 'json',
        });
        unitInfo = response.response;
        localStorage.setItem(`${LS_PREFIX}_unit_info`, JSON.stringify(unitInfo));
        localStorage.setItem(`${LS_PREFIX}_last_updated`, Date.parse(new Date()));
    } catch (error) {
        console.error(`${scriptInfo()} Error fetching unit info!`, error);
        unitInfo = null;
    }
}

// Helper: Calculates distance between two villages
function calculateDistance(origin, destination) {
    const [originX, originY] = origin.split('|').map(Number);
    const [destinationX, destinationY] = destination.split('|').map(Number);
    const distanceX = originX - destinationX;
    const distanceY = originY - destinationY;
    const distance = Math.sqrt(
        distanceX * distanceX + distanceY * distanceY
    );
    return distance;
}

// Helper: Get launch time
function getLaunchTime(unit, landingTime, distance) {
    if (!unitInfo || !unitInfo[unit]) {
        console.warn(`${scriptInfo()} Unit info not available for: ${unit}`);
        return NaN;
    }

    const travelTime = unitInfo[unit].speed * distance * 60 * 1000;
    return landingTime - travelTime;
}

// Helper: Formats date time
function formatDateTime(date) {
    const newDate = new Date(date);
    const day = String(newDate.getDate()).padStart(2, '0');
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const year = newDate.getFullYear();
    const hours = String(newDate.getHours()).padStart(2, '0');
    const minutes = String(newDate.getMinutes()).padStart(2, '0');
    const seconds = String(newDate.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Helper: Formats date for parsing
function formatDateForParse(dateString) {
    const parts = dateString.split(/[\s/:]/);
    const day = parts[0];
    const month = parts[1];
    const year = parts[2];
    const hours = parts[3];
    const minutes = parts[4];
    const seconds = parts[5];
    return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

// Helper: Gets URL parameter by name
function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// Helper: Gets script data from game_data.js
function getScriptData(name) {
    return game_data.scripts.get(name);
}

// Helper: Generates script info
function scriptInfo() {
    return `[${scriptData.name} ${scriptData.version}]`;
}

// Helper: Text Translator
function tt(string) {
    var gameLocale = game_data.locale;

    if (translations[gameLocale] !== undefined) {
        return translations[gameLocale][string];
    } else {
        return translations['en_DK'][string];
    }
}

// Initialize Script
(async function () {
    const gameScreen = getParameterByName('screen');
    if (gameScreen === 'overview') {
        await initAttackPlanner(GROUP_ID);
    } else {
        UI.ErrorMessage(tt('This script can only be run on a single village screen!'));
    }
})();