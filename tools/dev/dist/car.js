import {
  GLTFLoader
} from "./chunk-FN4W576G.js";
import {
  Box3,
  BoxGeometry,
  Color,
  CylinderGeometry,
  GUI,
  Group,
  LoadingManager,
  Mesh,
  MeshBasicMaterial,
  OrbitControls,
  PerspectiveCamera,
  SRGBColorSpace,
  Scene,
  Spherical,
  TOUCH,
  Vector3,
  WebGLRenderer,
  clear,
  devUrl,
  el,
  fetchJson,
  readFavs,
  repoUrl,
  shotLabel,
  writeFav
} from "./chunk-BZ6ZX5PL.js";

// ../tmp/viewer-deps/node_modules/three/examples/jsm/libs/meshopt_decoder.module.js
var MeshoptDecoder = (function() {
  "use strict";
  var wasm_base = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q;iekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq:P8Yqdbk;3sezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhDcbhqinaqae9pmeaDaeaq9RaqaDfae6Egkcsfgocl4cifcd4hxdndndndnaoc9WGgmTmbcbhPcehsawcjdfhzalhHinaraH9Rax6midnaraHaxfgl9RcK6mbczhoinawcj;cbfaogifgoc9WfhOdndndndndnaHaic9WfgAco4fRbbaAci4coG4ciGPlbedibkaO9cb83ibaOcwf9cb83ibxikaOalRblalRbbgAco4gCaCciSgCE86bbaocGfalclfaCfgORbbaAcl4ciGgCaCciSgCE86bbaocVfaOaCfgORbbaAcd4ciGgCaCciSgCE86bbaoc7faOaCfgORbbaAciGgAaAciSgAE86bbaoctfaOaAfgARbbalRbegOco4gCaCciSgCE86bbaoc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc93faAaCfgARbbaOciGgOaOciSgOE86bbaoc94faAaOfgARbbalRbdgOco4gCaCciSgCE86bbaoc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbaoc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbaoc97faAaCfgARbbaOciGgOaOciSgOE86bbaoc98faAaOfgORbbalRbiglco4gAaAciSgAE86bbaoc99faOaAfgORbbalcl4ciGgAaAciSgAE86bbaoc9:faOaAfgORbbalcd4ciGgAaAciSgAE86bbaocufaOaAfgoRbbalciGglalciSglE86bbaoalfhlxdkaOalRbwalRbbgAcl4gCaCcsSgCE86bbaocGfalcwfaCfgORbbaAcsGgAaAcsSgAE86bbaocVfaOaAfgORbbalRbegAcl4gCaCcsSgCE86bbaoc7faOaCfgORbbaAcsGgAaAcsSgAE86bbaoctfaOaAfgORbbalRbdgAcl4gCaCcsSgCE86bbaoc91faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc4faOaAfgORbbalRbigAcl4gCaCcsSgCE86bbaoc93faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc94faOaAfgORbbalRblgAcl4gCaCcsSgCE86bbaoc95faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc96faOaAfgORbbalRbvgAcl4gCaCcsSgCE86bbaoc97faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc98faOaAfgORbbalRbogAcl4gCaCcsSgCE86bbaoc99faOaCfgORbbaAcsGgAaAcsSgAE86bbaoc9:faOaAfgORbbalRbrglcl4gAaAcsSgAE86bbaocufaOaAfgoRbbalcsGglalcsSglE86bbaoalfhlxekaOal8Pbb83bbaOcwfalcwf8Pbb83bbalczfhlkdnaiam9pmbaiczfhoaral9RcL0mekkaiam6mialTmidnakTmbawaPfRbbhOcbhoazhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkkazcefhzaPcefgPad6hsalhHaPad9hmexvkkcbhlasceGmdxikalaxad2fhCdnakTmbcbhHcehsawcjdfhminaral9Rax6mialTmdalaxfhlawaHfRbbhOcbhoamhiinaiawcj;cbfaofRbbgAce4cbaAceG9R7aOfgO86bbaiadfhiaocefgoak9hmbkamcefhmaHcefgHad6hsaHad9hmbkaChlxikcbhocehsinaral9Rax6mdalTmealaxfhlaocefgoad6hsadao9hmbkaChlxdkcbhlasceGTmekc9:hoxikabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqalmbkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;ebf8Kjjjjbaok;yzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;siliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabavcefciGaiVcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:Ohkxekcjjjj94hkkabavcdfciGaiVcetfak87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:Ohqxekcjjjj94hqkabavcufciGaiVcetfaq87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohqxekcjjjj94hqkabavciGaiVcetfaq87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2geTmbinababydbgdcwtcw91:Yadce91cjjj;8ifcjjj98G::NUdbabclfhbaecufgembkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaiczfhiaeczfheadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklz9Kbb";
  var wasm_simd = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q;Aekr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq;t9tqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk;h8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhoaicefhldnadTmbaoc;WFbGgocjdaocjd6EhwcbhDinaDae9pmeawaeaD9RaDawfae6Egqcsfgoc9WGgkci2hxakcethmaocl4cifcd4hPabaDad2fhscbhzdnincehHalhOcbhAdninaraO9RaP6miavcj;cbfaAak2fhCaOaPfhlcbhidnakc;ab6mbaral9Rc;Gb6mbcbhoinaCaofhidndndndndnaOaoco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklbalczfhlkdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklzalczfhlkdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaialpbbbpklaalczfhlkdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaialpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalclfaYpQbfaXc:q:yjjbfRbbfhlxdkaialpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WalcwfaYpQbfaXc:q:yjjbfRbbfhlxekaialpbbbpkl8Walczfhlkaoc;abfhiaocjefak0meaihoaral9Rc;Fb0mbkkdndnaiak9pmbaici4hoinaral9RcK6mdaCaifhXdndndndndnaOaico4fRbbaocoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpklbxikaXalpbblalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalclfaYpQbfaKc:q:yjjbfRbbfhlxdkaXalpbbwalpbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbalcwfaYpQbfaKc:q:yjjbfRbbfhlxekaXalpbbbpklbalczfhlkaocdfhoaiczfgiak6mbkkalTmbaAci6hHalhOaAcefgohAaoclSmdxekkcbhlaHceGmdkdnakTmbavcjdfazfhiavazfpbdbhYcbhXinaiavcj;cbfaXfgopblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLaoakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEaoamfpblbg3cep9Ta3aQp9op9Hp9rg3aoaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfgoaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaoadfgoaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaoadfgoaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaoadfgoaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaoadfhiaXczfgXak6mbkkazclfgzad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfhDc9:hoalmexikkc9:hoxekcbc99aral9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk;uzeHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgDce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhqaicefgwarfhodnaeTmbcmcsaDceSEhkcbhxcbhmcbhDcbhicbhlindnaoaq9nmbc9:hoxikdndnawRbbgrc;Ve0mbavc;abfalarcl4cu7fcsGcitfgPydlhsaPydbhzdnarcsGgPak9pmbavaiarcu7fcsGcdtfydbaxaPEhraPThPdndnadcd9hmbabaDcetfgHaz87ebaHcdfas87ebaHclfar87ebxekabaDcdtfgHazBdbaHclfasBdbaHcwfarBdbkaxaPfhxavc;abfalcitfgHarBdbaHasBdlavaicdtfarBdbavc;abfalcefcsGglcitfgHazBdbaHarBdlaiaPfhialcefhlxdkdndnaPcsSmbamaPfaPc987fcefhmxekaocefhrao8SbbgPcFeGhHdndnaPcu9mmbarhoxekaocvfhoaHcFbGhHcrhPdninar8SbbgOcFbGaPtaHVhHaOcu9kmearcefhraPcrfgPc8J9hmbxdkkarcefhokaHce4cbaHceG9R7amfhmkdndnadcd9hmbabaDcetfgraz87ebarcdfas87ebarclfam87ebxekabaDcdtfgrazBdbarclfasBdbarcwfamBdbkavc;abfalcitfgramBdbarasBdlavaicdtfamBdbavc;abfalcefcsGglcitfgrazBdbaramBdlaicefhialcefhlxekdnarcpe0mbaxcefgOavaiaqarcsGfRbbgPcl49RcsGcdtfydbaPcz6gHEhravaiaP9RcsGcdtfydbaOaHfgsaPcsGgOEhPaOThOdndnadcd9hmbabaDcetfgzax87ebazcdfar87ebazclfaP87ebxekabaDcdtfgzaxBdbazclfarBdbazcwfaPBdbkavaicdtfaxBdbavc;abfalcitfgzarBdbazaxBdlavaicefgicsGcdtfarBdbavc;abfalcefcsGcitfgzaPBdbazarBdlavaiaHfcsGgicdtfaPBdbavc;abfalcdfcsGglcitfgraxBdbaraPBdlalcefhlaiaOfhiasaOfhxxekaxcbaoRbbgzEgAarc;:eSgrfhsazcsGhCazcl4hXdndnazcs0mbascefhOxekashOavaiaX9RcsGcdtfydbhskdndnaCmbaOcefhxxekaOhxavaiaz9RcsGcdtfydbhOkdndnarTmbaocefhrxekaocdfhrao8SbegHcFeGhPdnaHcu9kmbaocofhAaPcFbGhPcrhodninar8SbbgHcFbGaotaPVhPaHcu9kmearcefhraocrfgoc8J9hmbkaAhrxekarcefhrkaPce4cbaPceG9R7amfgmhAkdndnaXcsSmbarhPxekarcefhPar8SbbgocFeGhHdnaocu9kmbarcvfhsaHcFbGhHcrhodninaP8SbbgrcFbGaotaHVhHarcu9kmeaPcefhPaocrfgoc8J9hmbkashPxekaPcefhPkaHce4cbaHceG9R7amfgmhskdndnaCcsSmbaPhoxekaPcefhoaP8SbbgrcFeGhHdnarcu9kmbaPcvfhOaHcFbGhHcrhrdninao8SbbgPcFbGartaHVhHaPcu9kmeaocefhoarcrfgrc8J9hmbkaOhoxekaocefhokaHce4cbaHceG9R7amfgmhOkdndnadcd9hmbabaDcetfgraA87ebarcdfas87ebarclfaO87ebxekabaDcdtfgraABdbarclfasBdbarcwfaOBdbkavc;abfalcitfgrasBdbaraABdlavaicdtfaABdbavc;abfalcefcsGcitfgraOBdbarasBdlavaicefgicsGcdtfasBdbavc;abfalcdfcsGcitfgraABdbaraOBdlavaiazcz6aXcsSVfgicsGcdtfaOBdbaiaCTaCcsSVfhialcifhlkawcefhwalcsGhlaicsGhiaDcifgDae6mbkkcbc99aoaqSEhokavc;aef8Kjjjjbaok:llevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaicd4cbaice4ceG9R7avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:EPliuo97eue978Jjjjjbca9Rhidndnadcl9hmbdnaec98GglTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalae9pmeaiaeciGgvcdtgdVcbczad9R;8kbaiabalcdtfglad;8qbbdnavTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkalaiad;8qbbskdnaec98GgxTmbcbhvabhdinadczfglalpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oawaopmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgvax6mbkkaxae9pmbaiaeciGgvcitgdfcbcaad9R;8kbaiabaxcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eaDaopmbediwDqkzHOAKY8AEgoczp:Sep;6egrp;Geaoczp:Reczp:Sep;6egwp;Gep;Kep;Legopxb;:FSb;:FSb;:FSb;:FSawaopxbbbbbbbbbbbbbbbbp:2egqawpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegwawp;Meaoaop;Mearaqaramp9op9rp;Kegoaop;Mep;Kep;Kep;Jep;Negrp;Mepxbbn0bbn0bbn0bbn0gqp;Keczp:Reawarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9op9qgwaoarp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogopmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oawaopmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalae9pmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaqakp;Mearp;Keczp:ReaDakp;Mearp;Keamp9op9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbhdabheinaeaepbbbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepkbbaeczfheadclfgdav6mbkkdnaval9pmbaialciGgdcdtgeVcbc;abae9R;8kbaiabavcdtfgvae;8qbbdnadTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjZbbjZbbjZbbjZp:UepxbbjFbbjFbbjFbbjFp9op;Mepklbkavaiae;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz9Tbb";
  var detector = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3, 3, 2, 0, 0, 5, 3, 1, 0, 1, 12, 1, 0, 10, 22, 2, 12, 0, 65, 0, 65, 0, 65, 0, 252, 10, 0, 0, 11, 7, 0, 65, 0, 253, 15, 26, 11]);
  var wasmpack = new Uint8Array([32, 0, 65, 2, 1, 106, 34, 33, 3, 128, 11, 4, 13, 64, 6, 253, 10, 7, 15, 116, 127, 5, 8, 12, 40, 16, 19, 54, 20, 9, 27, 255, 113, 17, 42, 67, 24, 23, 146, 148, 18, 14, 22, 45, 70, 69, 56, 114, 101, 21, 25, 63, 75, 136, 108, 28, 118, 29, 73, 115]);
  if (typeof WebAssembly !== "object") {
    return {
      supported: false
    };
  }
  var wasm = WebAssembly.validate(detector) ? wasm_simd : wasm_base;
  var instance;
  var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
    instance = result.instance;
    instance.exports.__wasm_call_ctors();
  });
  function unpack(data) {
    var result = new Uint8Array(data.length);
    for (var i = 0; i < data.length; ++i) {
      var ch = data.charCodeAt(i);
      result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
    }
    var write = 0;
    for (var i = 0; i < data.length; ++i) {
      result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
    }
    return result.buffer.slice(0, write);
  }
  function decode(fun, target, count, size, source, filter) {
    var sbrk = instance.exports.sbrk;
    var count4 = count + 3 & ~3;
    var tp = sbrk(count4 * size);
    var sp = sbrk(source.length);
    var heap = new Uint8Array(instance.exports.memory.buffer);
    heap.set(source, sp);
    var res = fun(tp, count, size, sp, source.length);
    if (res == 0 && filter) {
      filter(tp, count4, size);
    }
    target.set(heap.subarray(tp, tp + count * size));
    sbrk(tp - sbrk(0));
    if (res != 0) {
      throw new Error("Malformed buffer data: " + res);
    }
  }
  var filters = {
    NONE: "",
    OCTAHEDRAL: "meshopt_decodeFilterOct",
    QUATERNION: "meshopt_decodeFilterQuat",
    EXPONENTIAL: "meshopt_decodeFilterExp"
  };
  var decoders = {
    ATTRIBUTES: "meshopt_decodeVertexBuffer",
    TRIANGLES: "meshopt_decodeIndexBuffer",
    INDICES: "meshopt_decodeIndexSequence"
  };
  var workers = [];
  var requestId = 0;
  function createWorker(url) {
    var worker = {
      object: new Worker(url),
      pending: 0,
      requests: {}
    };
    worker.object.onmessage = function(event) {
      var data = event.data;
      worker.pending -= data.count;
      worker.requests[data.id][data.action](data.value);
      delete worker.requests[data.id];
    };
    return worker;
  }
  function initWorkers(count) {
    var source = "var instance; var ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(unpack(wasm)) + "]), {}).then(function(result) { instance = result.instance; instance.exports.__wasm_call_ctors(); });self.onmessage = workerProcess;" + decode.toString() + workerProcess.toString();
    var blob = new Blob([source], { type: "text/javascript" });
    var url = URL.createObjectURL(blob);
    for (var i = 0; i < count; ++i) {
      workers[i] = createWorker(url);
    }
    URL.revokeObjectURL(url);
  }
  function decodeWorker(count, size, source, mode, filter) {
    var worker = workers[0];
    for (var i = 1; i < workers.length; ++i) {
      if (workers[i].pending < worker.pending) {
        worker = workers[i];
      }
    }
    return new Promise(function(resolve, reject) {
      var data = new Uint8Array(source);
      var id = requestId++;
      worker.pending += count;
      worker.requests[id] = { resolve, reject };
      worker.object.postMessage({ id, count, size, source: data, mode, filter }, [data.buffer]);
    });
  }
  function workerProcess(event) {
    ready.then(function() {
      var data = event.data;
      try {
        var target = new Uint8Array(data.count * data.size);
        decode(instance.exports[data.mode], target, data.count, data.size, data.source, instance.exports[data.filter]);
        self.postMessage({ id: data.id, count: data.count, action: "resolve", value: target }, [target.buffer]);
      } catch (error) {
        self.postMessage({ id: data.id, count: data.count, action: "reject", value: error });
      }
    });
  }
  return {
    ready,
    supported: true,
    useWorkers: function(count) {
      initWorkers(count);
    },
    decodeVertexBuffer: function(target, count, size, source, filter) {
      decode(instance.exports.meshopt_decodeVertexBuffer, target, count, size, source, instance.exports[filters[filter]]);
    },
    decodeIndexBuffer: function(target, count, size, source) {
      decode(instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
    },
    decodeIndexSequence: function(target, count, size, source) {
      decode(instance.exports.meshopt_decodeIndexSequence, target, count, size, source);
    },
    decodeGltfBuffer: function(target, count, size, source, mode, filter) {
      decode(instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
    },
    decodeGltfBufferAsync: function(count, size, source, mode, filter) {
      if (workers.length > 0) {
        return decodeWorker(count, size, source, decoders[mode], filters[filter]);
      }
      return ready.then(function() {
        var target = new Uint8Array(count * size);
        decode(instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
        return target;
      });
    }
  };
})();

// tools/dev/src/car-guests.js
var manager = new LoadingManager();
var colormapUrl = "";
manager.setURLModifier((url) => colormapUrl && url.indexOf("colormap") !== -1 ? colormapUrl : url);
var loader = new GLTFLoader(manager);
loader.setMeshoptDecoder(MeshoptDecoder);
var cache = /* @__PURE__ */ new Map();
var colormapJob = null;
function trafficBase(url) {
  const i = String(url || "").lastIndexOf("/");
  return i >= 0 ? url.slice(0, i + 1) : "";
}
function ensureColormap(base) {
  if (colormapUrl || !base) return Promise.resolve();
  if (colormapJob) return colormapJob;
  colormapJob = fetch(base + "colormap.js").then((res) => res.text()).then((text) => {
    const start = text.indexOf("data:image/png;base64,");
    const end = text.indexOf('"', start);
    if (start >= 0 && end > start) colormapUrl = text.slice(start, end);
  }).catch(() => {
    colormapJob = null;
  });
  return colormapJob;
}
function b64(text, id) {
  const token = "['" + id + `']="`;
  const at = text.indexOf(token);
  if (at < 0) throw new Error("traffic asset " + id + " missing");
  const start = at + token.length;
  const end = text.indexOf('"', start);
  if (end < 0) throw new Error("traffic asset " + id + " truncated");
  const raw = atob(text.slice(start, end));
  const buf = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) buf[i] = raw.charCodeAt(i);
  return buf.buffer;
}
function asBasic(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.castShadow = false;
    o.receiveShadow = false;
    o.frustumCulled = false;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    const next = mats.map((m) => {
      if (!m) return m;
      const basic = new MeshBasicMaterial({
        name: m.name || "",
        color: m.color ? m.color.clone() : 16777215,
        map: m.map || null
      });
      basic.fog = false;
      basic.skinning = !!o.isSkinnedMesh;
      return basic;
    });
    o.material = Array.isArray(o.material) ? next : next[0];
  });
}
function sit(root) {
  root.updateMatrixWorld(true);
  const box = new Box3().setFromObject(root);
  root.position.y -= box.min.y;
  root.updateMatrixWorld(true);
  const sized = new Box3().setFromObject(root);
  const size = sized.getSize(new Vector3());
  if (size.x > size.z) root.rotation.y = Math.PI / 2;
  root.updateMatrixWorld(true);
  return new Box3().setFromObject(root).getSize(new Vector3());
}
function modelById(catalog, id) {
  return (catalog.models || []).find((m) => m.id === id) || catalog.models[0];
}
async function guestGroup(model) {
  if (cache.has(model.id)) return cache.get(model.id);
  let group;
  let size;
  if (model.kind === "tow") {
    group = buildTow(model);
    size = new Box3().setFromObject(group).getSize(new Vector3());
  } else if (model.kind === "kenney") {
    const res = await fetch(model.url);
    if (!res.ok) throw new Error("missing " + model.file);
    await Promise.all([MeshoptDecoder.ready, ensureColormap(trafficBase(model.url))]);
    const buf = b64(await res.text(), model.asset);
    const gltf = await new Promise((resolve, reject) => {
      loader.parse(buf, "", resolve, reject);
    });
    group = gltf.scene;
    asBasic(group);
    size = sit(group);
  } else {
    throw new Error("not a guest " + model.id);
  }
  group.userData.size = { x: size.x, y: size.y, z: size.z };
  cache.set(model.id, group);
  return group;
}
function buildTow(spec) {
  const g = new Group();
  const mat = (color) => {
    const m = new MeshBasicMaterial({ color });
    m.fog = false;
    return m;
  };
  const L = spec.l;
  const w = spec.w;
  const h = spec.h;
  const bed = spec.bed;
  const cabL = spec.cabL;
  const cabH = spec.cabH;
  const bedMesh = new Mesh(new BoxGeometry(w * 0.92, 0.18, bed), mat("#c9853a"));
  bedMesh.position.set(0, 0.35 + h * 0.35, -L / 2 + bed / 2);
  bedMesh.rotation.x = -Math.atan2(h * 0.75, bed);
  bedMesh.userData.role = "bed";
  const cab = new Mesh(new BoxGeometry(w, cabH, cabL), mat("#ffb020"));
  cab.position.set(0, cabH / 2, L / 2 - cabL / 2);
  cab.userData.role = "cab";
  const glass = new Mesh(new BoxGeometry(w * 0.72, cabH * 0.28, 0.06), mat("#9ff3ff"));
  glass.position.set(0, cabH * 0.62, L / 2 - 0.04);
  const wheelGeo = new CylinderGeometry(0.55, 0.55, 0.28, 16);
  wheelGeo.rotateZ(Math.PI / 2);
  const zs = [-L / 2 + 1.6, -L / 2 + bed - 1.2, L / 2 - cabL * 0.45];
  for (const z of zs) {
    for (const x of [-w / 2, w / 2]) {
      const wheel = new Mesh(wheelGeo, mat("#14161c"));
      wheel.position.set(x, 0.55, z);
      wheel.userData.role = "wheel";
      g.add(wheel);
    }
  }
  g.add(bedMesh, cab, glass);
  return g;
}
function scanGroup(root) {
  const bad = [];
  if (!root) return bad;
  root.updateMatrixWorld(true);
  root.traverse((o) => {
    const e = o.matrixWorld && o.matrixWorld.elements;
    if (e) {
      for (let i = 0; i < 16; i++) {
        if (!Number.isFinite(e[i])) {
          bad.push((o.name || o.type) + " nan");
          break;
        }
      }
    }
    if (!o.isMesh) return;
    const mats = Array.isArray(o.material) ? o.material : [o.material];
    for (const m of mats) {
      if (m && m.map && !m.map.image) bad.push((m.name || "map") + " texture");
    }
    if (o.skeleton && o.skeleton.boneMatrices) {
      const bones = o.skeleton.boneMatrices;
      for (let i = 0; i < bones.length; i++) {
        if (!Number.isFinite(bones[i])) {
          bad.push("nan bone");
          break;
        }
      }
    }
  });
  return bad;
}

// tools/dev/src/car.js
var ANGLES = [
  { id: "front", name: "Front", yaw: 0, pitch: 0.22 },
  { id: "three", name: "3/4", yaw: 0.7, pitch: 0.24 },
  { id: "side", name: "Side", yaw: 1.5708, pitch: 0.2 },
  { id: "back", name: "Back", yaw: 3.1416, pitch: 0.22 },
  { id: "top", name: "Top", yaw: 0.4, pitch: 1.15 }
];
var scriptPromise = null;
function inject(url) {
  return new Promise((resolve, reject) => {
    const prev = document.querySelector('script[data-zd="' + url + '"]');
    if (prev) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = url;
    s.async = false;
    s.dataset.zd = url;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("script " + url));
    document.body.appendChild(s);
  });
}
function loadXray() {
  if (scriptPromise) return scriptPromise;
  scriptPromise = (async () => {
    window.ZD = window.ZD || {};
    window.ZD.perf = window.ZD.perf || { dpr() {
      return 1;
    }, low: true };
    window.ZD.perf.low = true;
    window.ZD.perf.dpr = () => 1;
    await inject(repoUrl("shared/assets/370z-glb.js"));
    await inject(repoUrl("shared/zd-embed.js"));
    await inject(repoUrl("shared/car-model.js"));
    const X = window.ZD && window.ZD.Xray;
    if (!X) throw new Error("Xray did not start");
    const t0 = Date.now();
    while (!X.ready) {
      if (Date.now() - t0 > 9e4) throw new Error("Xray GLB timed out");
      await new Promise((r) => setTimeout(r, 40));
    }
    await inject(repoUrl("shared/car-hinge.js"));
    return X;
  })();
  return scriptPromise;
}
function hex(color) {
  if (!color || !color.getHexString) return "#ffffff";
  return "#" + color.getHexString();
}
function createModule() {
  let alive = false;
  let host = null;
  let ctx = null;
  let catalog = null;
  let X = null;
  let base = null;
  let gui = null;
  let canvas = null;
  let ctx2 = null;
  let camera = null;
  let controls = null;
  let raf = 0;
  let eqA = null;
  let eqB = null;
  let edit = "a";
  let compare = false;
  let angleId = "three";
  let turn = true;
  let wantTurn = true;
  let resumeTimer = 0;
  let ready = false;
  let pending = null;
  let checkerNote = "";
  const errors = [];
  const ui = {};
  let last = { yaw: 0.7, pitch: 0.24, dist: 10.5 };
  let guestRenderer = null;
  let guestScene = null;
  let guestCam = null;
  let guestJob = null;
  let sweeping = false;
  const shown = { a: null, b: null };
  const samples = [];
  function defaults() {
    return Object.assign({}, catalog.defaults);
  }
  function eqOf(which) {
    return which === "b" ? eqB : eqA;
  }
  function hook() {
    const orig = console.error;
    console.error = (...args) => {
      errors.push(args.map((x) => x && x.message || String(x)).join(" "));
      orig.apply(console, args);
    };
    const onErr = (e) => errors.push(String(e.message || e));
    window.addEventListener("error", onErr);
    return () => {
      console.error = orig;
      window.removeEventListener("error", onErr);
    };
  }
  let unhook = () => {
  };
  function opt(slot, id) {
    const spec = catalog.slots[slot];
    return spec.options.find((o) => o.id === id) || spec.options[0];
  }
  function currentModel(eq) {
    return modelById(catalog, eq && eq.model || "370z");
  }
  function kidOf(eq) {
    const paint = opt("paint", eq.paint);
    const wheels = opt("wheels", eq.wheels);
    const spoiler = opt("spoiler", eq.spoiler);
    const caliper = opt("caliper", eq.caliper);
    const glow = opt("underglow", eq.underglow);
    const vinyl = opt("vinyl", eq.vinyl);
    const kit = opt("kit", eq.kit);
    const bumper = opt("bumper", eq.bumper);
    const dressed = !!(kit.lip || kit.skirts || kit.diffuser || kit.spoiler || kit.tips || bumper.bumper || vinyl.grid);
    const plain = paint.kind === "game" && wheels.kind === "game" && !spoiler.spoiler && caliper.kind === "game" && !glow.underglow && !dressed;
    if (plain) return null;
    return {
      paint: paint.paint || base.paint,
      glow: paint.glow || base.glow,
      grid: vinyl.grid || paint.grid || base.grid,
      wheel: wheels.wheel || base.wheel,
      wheelGlow: !!wheels.wheelGlow,
      spoiler: kit.spoiler || spoiler.spoiler || null,
      wings: null,
      extra: null,
      extras: [],
      lip: kit.lip || null,
      skirts: kit.skirts || null,
      diffuser: kit.diffuser || null,
      tips: kit.tips || null,
      underglow: glow.underglow || null,
      bumper: bumper.bumper || null,
      caliper: caliper.caliper || base.caliper
    };
  }
  function readOrbit() {
    const offset = camera.position.clone().sub(controls.target);
    const sph = new Spherical().setFromVector3(offset);
    last = {
      yaw: Math.PI / 2 - sph.theta,
      pitch: Math.PI / 2 - sph.phi,
      dist: sph.radius,
      ty: controls.target.y
    };
    return last;
  }
  function place(yaw, pitch, dist) {
    const target = controls.target;
    camera.position.set(
      target.x + Math.cos(yaw) * Math.cos(pitch) * dist,
      target.y + Math.sin(pitch) * dist,
      target.z + Math.sin(yaw) * Math.cos(pitch) * dist
    );
    controls.update();
  }
  function paintName(eq) {
    const paint = opt("paint", eq.paint);
    return paint.name;
  }
  function makeLabel() {
    const angle = ANGLES.find((a) => a.id === angleId) || ANGLES[0];
    return currentModel(eqA).name + " \xB7 " + angle.name + " \xB7 " + paintName(eqA) + " \xB7 f0";
  }
  function spanOf(eq) {
    const model = currentModel(eq);
    if (model.kind === "tow") return model.l;
    if (model.kind === "xray") return catalog.facts.l;
    const which = eq === eqB ? "b" : "a";
    const size = shown[which] && shown[which].userData.size;
    return size ? Math.max(size.x, size.z) : 4;
  }
  function sharedDist(orbit) {
    const need = Math.max(spanOf(eqA), compare ? spanOf(eqB) : 0);
    if (need < 6) return orbit.dist;
    return Math.max(orbit.dist, need * 1.15);
  }
  function aimGuest(orbit, targetY) {
    const dist = sharedDist(orbit);
    guestCam.fov = 26;
    guestCam.aspect = canvas.width / Math.max(1, canvas.height);
    guestCam.position.set(
      Math.cos(orbit.yaw) * Math.cos(orbit.pitch) * dist,
      targetY + Math.sin(orbit.pitch) * dist,
      Math.sin(orbit.yaw) * Math.cos(orbit.pitch) * dist
    );
    guestCam.lookAt(0, targetY, 0);
    guestCam.updateProjectionMatrix();
  }
  function paintGuest(group, x, w, h, orbit) {
    if (!group || !guestRenderer || w < 2 || h < 2) return;
    for (const child of guestScene.children) child.visible = child === group;
    group.visible = true;
    aimGuest(orbit, group.userData.size && group.userData.size.y * 0.45 || 0.6);
    guestRenderer.setSize(w, h, false);
    guestRenderer.render(guestScene, guestCam);
    ctx2.drawImage(guestRenderer.domElement, x, 0, w, h);
  }
  function guestReady() {
    const list = compare ? [eqA, eqB] : [eqA];
    for (const eq of list) {
      const model = currentModel(eq);
      if (model.kind === "xray") continue;
      const which = eq === eqB ? "b" : "a";
      if (!shown[which] || shown[which].userData.modelId !== model.id) return false;
    }
    return true;
  }
  function ensureDraw(depth) {
    depth = depth || 0;
    if (guestJob) {
      return guestJob.then(() => guestReady() || depth > 2 ? null : ensureDraw(depth + 1));
    }
    if (guestReady()) {
      draw();
      designText();
      return Promise.resolve();
    }
    guestJob = (async () => {
      const list = compare ? [["a", eqA], ["b", eqB]] : [["a", eqA]];
      for (const [which, eq] of list) {
        const model = currentModel(eq);
        if (model.kind === "xray") {
          if (shown[which]) shown[which].visible = false;
          continue;
        }
        const group = await guestGroup(Object.assign({}, model, { url: model.file ? repoUrl(model.file) : "" }));
        group.userData.modelId = model.id;
        if (guestScene && !group.parent) guestScene.add(group);
        shown[which] = group;
      }
      if (alive) {
        draw();
        designText();
      }
    })().catch((err) => {
      errors.push(String(err && err.message || err));
    }).finally(() => {
      guestJob = null;
    });
    return guestJob;
  }
  function blit(look, x, w, h, orbit) {
    X.render(ctx2, 0, 0, w, h, {
      xray: false,
      yaw: orbit.yaw,
      pitch: orbit.pitch,
      dist: orbit.dist,
      ty: orbit.ty,
      fov: 26,
      drl: 1,
      kid: look,
      noDraw: true,
      st: { t: 0, throttle: 0 }
    });
    ctx2.drawImage(X.canvas, x, 0, w, h);
  }
  function paintSide(eq, which, x, w, h, orbit) {
    const model = currentModel(eq);
    if (model.kind === "xray") blit(kidOf(eq), x, w, h, Object.assign({}, orbit, { dist: sharedDist(orbit) }));
    else paintGuest(shown[which], x, w, h, orbit);
  }
  function draw() {
    if (!X || !X.ready || !canvas) return;
    const orbit = readOrbit();
    const w = canvas.width;
    const h = canvas.height;
    ctx2.fillStyle = "#07010f";
    ctx2.fillRect(0, 0, w, h);
    if (compare) {
      const hw = Math.floor(w / 2);
      paintSide(eqA, "a", 0, hw, h, orbit);
      paintSide(eqB, "b", hw, w - hw, h, orbit);
      ui.syncYaw = orbit.yaw;
    } else {
      paintSide(eqA, "a", 0, w, h, orbit);
    }
  }
  function resize() {
    const stage = canvas.parentElement;
    const w = Math.max(2, stage.clientWidth || 640);
    const h = Math.max(2, stage.clientHeight || 480);
    canvas.width = w;
    canvas.height = h;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  function finiteCar() {
    const bad = [];
    X.car.updateMatrixWorld(true);
    X.car.traverse((o) => {
      const e = o.matrixWorld && o.matrixWorld.elements;
      if (!e) return;
      for (let i = 0; i < 16; i++) {
        if (!Number.isFinite(e[i])) {
          bad.push(o.name || o.type);
          break;
        }
      }
      if (o.isMesh) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          if (m && m.map && !m.map.image) bad.push((m.name || "map") + " texture");
        }
      }
    });
    return bad;
  }
  function visibleSize() {
    const box = new X.THREE_Box3();
    const tmp = new X.THREE_Vector3();
    let any = false;
    X.car.updateMatrixWorld(true);
    X.car.traverse((o) => {
      if (!o.isMesh || o.visible === false || !o.geometry) return;
      let parent = o.parent;
      while (parent) {
        if (parent.visible === false) return;
        parent = parent.parent;
      }
      const geo = o.geometry;
      if (!geo.boundingBox) geo.computeBoundingBox();
      const bb = geo.boundingBox;
      if (!bb) return;
      for (const x of [bb.min.x, bb.max.x]) {
        for (const y of [bb.min.y, bb.max.y]) {
          for (const z of [bb.min.z, bb.max.z]) {
            tmp.set(x, y, z).applyMatrix4(o.matrixWorld);
            if (!Number.isFinite(tmp.x)) return;
            box.expandByPoint(tmp);
            any = true;
          }
        }
      }
    });
    return any ? box.getSize(new X.THREE_Vector3()) : new X.THREE_Vector3();
  }
  function designText() {
    const facts = catalog.facts;
    const model = currentModel(eqA);
    const lines = [];
    lines.push(facts.car + "  " + facts.l + " \xD7 " + facts.w + " \xD7 " + facts.h + " m \xB7 wheelbase " + facts.wb + " m");
    lines.push(facts.paint + " \xB7 " + facts.wheels + " \xB7 tips " + facts.tips);
    lines.push(facts.bumper);
    if (model.kind === "xray") {
      const cfg = window.ZD_EMBED && window.ZD_EMBED.cfg;
      lines.push(cfg && cfg.file === catalog.cfgFile ? "PASS  same GLB path " + cfg.file : "FAIL  GLB path " + (cfg && cfg.file));
      const size = visibleSize();
      const length = Math.max(size.x, size.z);
      lines.push(Math.abs(length - facts.l) < 0.2 ? "PASS  length " + length.toFixed(2) + " m (" + facts.l + ")" : "FAIL  length " + length.toFixed(2) + " m");
      lines.push(Math.abs(size.y - facts.h) < 0.25 ? "PASS  height " + size.y.toFixed(2) + " m (" + facts.h + ")" : "FAIL  height " + size.y.toFixed(2) + " m");
      const bad = finiteCar();
      lines.push(bad.length ? "FAIL  " + bad.slice(0, 3).join(", ") : "PASS  matrices and textures finite");
      if (opt("bumper", eqA.bumper).bumper) lines.push("CHECK  Stillen is on hold. The shipped look forces bumper null.");
    } else {
      const size = shown.a && shown.a.userData.size;
      const measured = size ? Math.max(size.x, size.z).toFixed(2) + " \xD7 " + size.y.toFixed(2) + " \xD7 " + Math.min(size.x, size.z).toFixed(2) + " m" : "not loaded";
      lines.push("CHECK  " + model.name + " native " + measured + " \xB7 not " + catalog.cfgFile);
      lines.push("CHECK  rule 6: a close copy has to be the 370Z GLB");
      if (model.kind === "tow") lines.push("PASS  tow wheels are discs facing the side, radius 0.55 m");
      const bad = scanGroup(shown.a);
      lines.push(bad.length ? "FAIL  " + bad.slice(0, 3).join(", ") : "PASS  matrices and textures finite");
    }
    lines.push("PASS  this spinner does not call shadowBlur");
    lines.push("Ellie 1.50 m beside this car");
    lines.push(checkerNote);
    for (const rule of catalog.design.rules) lines.push("\xB7 " + rule);
    for (const finding of catalog.design.findings || []) lines.push("CHECK  " + finding);
    ui.bar.textContent = lines.join("\n");
    return lines;
  }
  function paintChips() {
    clear(ui.chips);
    const secs = el("div", "zsecs");
    for (const sec of catalog.sections) {
      const b = el("button", "zsec" + (ui.section === sec.id ? " on" : ""), sec.name);
      b.type = "button";
      b.addEventListener("click", () => {
        ui.section = sec.id;
        paintChips();
      });
      secs.appendChild(b);
    }
    ui.chips.appendChild(secs);
    const row = el("div", "zitems");
    const eq = eqOf(edit);
    if (ui.section === "looks") {
      const name = el("input", "zname");
      name.placeholder = "Favorite name";
      const save = el("button", "zchip", "SAVE LOOK");
      save.type = "button";
      save.addEventListener("click", () => {
        writeFav("car", (name.value || "Look").trim(), Object.assign({}, eq));
        paintChips();
      });
      row.append(name, save);
      for (const [title, saved] of Object.entries(readFavs("car"))) {
        const b = el("button", "zchip", title);
        b.type = "button";
        b.addEventListener("click", () => {
          const next = Object.assign(defaults(), saved);
          if (edit === "b") eqB = next;
          else eqA = next;
          refreshGui();
          paintChips();
        });
        row.appendChild(b);
      }
    } else {
      const sec = catalog.sections.find((s) => s.id === ui.section);
      for (const slot of sec && sec.slots || []) {
        const spec = catalog.slots[slot];
        row.appendChild(el("div", "zgroup", spec.name));
        for (const opt2 of spec.options) {
          const b = el("button", "zchip" + (eq[slot] === opt2.id ? " on" : ""), opt2.name);
          b.type = "button";
          if (opt2.paint) b.style.setProperty("--swatch", opt2.paint);
          b.addEventListener("click", () => {
            eq[slot] = opt2.id;
            ui.silent = true;
            if (ui.ctrls[slot]) ui.ctrls[slot].setValue(opt2.id);
            ui.silent = false;
            paintChips();
            ensureDraw();
            if (ctx && ctx.onSave) ctx.onSave();
          });
          row.appendChild(b);
        }
      }
    }
    ui.chips.appendChild(row);
  }
  function refreshGui() {
    if (!ui.ctrls) return;
    ui.silent = true;
    const eq = eqOf(edit);
    for (const [slot, ctrl] of Object.entries(ui.ctrls)) ctrl.setValue(eq[slot]);
    ui.silent = false;
  }
  function layout() {
    host.innerHTML = "";
    const spin = el("div", "zspin");
    const stageHost = el("div", "zstage");
    canvas = el("canvas", "zview");
    ctx2 = canvas.getContext("2d");
    ui.angles = el("div", "zangles");
    ui.ruler = el("div", "zruler", "370Z \xB7 same Xray shader as the game");
    const menu = el("aside", "zmenu");
    ui.status = el("div", "zstatus", "Loading the 370Z\u2026");
    ui.chips = el("div", "zchips");
    ui.gui = el("div", "zgui");
    ui.bar = el("pre", "zbar");
    stageHost.append(canvas, ui.ruler, ui.angles);
    menu.append(ui.status, ui.chips, ui.gui, ui.bar);
    spin.append(stageHost, menu);
    host.appendChild(spin);
    guestRenderer = new WebGLRenderer({ antialias: false, alpha: false, preserveDrawingBuffer: true });
    guestRenderer.setPixelRatio(1);
    guestRenderer.outputColorSpace = SRGBColorSpace;
    guestRenderer.shadowMap.enabled = false;
    guestRenderer.setClearColor(459023, 1);
    guestScene = new Scene();
    guestScene.background = new Color(459023);
    guestCam = new PerspectiveCamera(26, 1, 0.08, 200);
    camera = new PerspectiveCamera(26, 1, 0.1, 80);
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotateSpeed = 4.3;
    controls.touches.ONE = TOUCH.ROTATE;
    controls.touches.TWO = TOUCH.DOLLY_PAN;
    controls.target.set(0, 0.45, 0);
    controls.minDistance = 4;
    controls.maxDistance = 24;
    place(0.7, 0.24, 10.5);
    controls.autoRotate = true;
    canvas.addEventListener("pointerdown", () => {
      controls.autoRotate = false;
      if (resumeTimer) clearTimeout(resumeTimer);
      if (wantTurn) resumeTimer = setTimeout(() => {
        controls.autoRotate = true;
      }, 2500);
    });
    for (const angle of ANGLES) {
      const b = el("button", "zbtn" + (angle.id === angleId ? " on" : ""), angle.name);
      b.type = "button";
      b.dataset.id = angle.id;
      b.addEventListener("click", () => {
        angleId = angle.id;
        const dist = camera.position.distanceTo(controls.target) || 10.5;
        place(angle.yaw, angle.pitch, dist);
        for (const btn of ui.angles.querySelectorAll("button[data-id]")) btn.classList.toggle("on", btn.dataset.id === angle.id);
      });
      ui.angles.appendChild(b);
    }
    const turnBtn = el("button", "zbtn on", "TURN");
    turnBtn.type = "button";
    turnBtn.addEventListener("click", () => {
      wantTurn = !wantTurn;
      turn = wantTurn;
      controls.autoRotate = wantTurn;
      turnBtn.classList.toggle("on", wantTurn);
    });
    const compareBtn = el("button", "zbtn", "COMPARE");
    compareBtn.type = "button";
    compareBtn.addEventListener("click", () => {
      compare = !compare;
      compareBtn.classList.toggle("on", compare);
      if (compare && !eqB) eqB = defaults();
    });
    const shot = el("button", "zbtn", "SAVE SHOT");
    shot.type = "button";
    shot.addEventListener("click", () => capture(true));
    ui.angles.append(turnBtn, compareBtn, shot);
    ui.compareBtn = compareBtn;
    gui = new GUI({ container: ui.gui, title: "PAINT", autoPlace: false });
    ui.viewEq = Object.assign({}, eqA);
    ui.ctrls = {};
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      const choices = {};
      for (const item of spec.options) choices[item.name] = item.id;
      ui.ctrls[slot] = gui.add(ui.viewEq, slot, choices).name(spec.name).onChange((value) => {
        if (ui.silent) return;
        eqOf(edit)[slot] = value;
        paintChips();
        ensureDraw();
        if (ctx && ctx.onSave) ctx.onSave();
      });
    }
    ui.section = "paint";
    const obs = new ResizeObserver(() => resize());
    obs.observe(stageHost);
    ui.obs = obs;
    resize();
    let prev = performance.now();
    const loop = (now) => {
      if (!alive) return;
      const dt = Math.min(0.05, (now - prev) / 1e3);
      prev = now;
      controls.update(dt);
      const t1 = performance.now();
      if (!sweeping && !guestReady()) ensureDraw();
      else draw();
      samples.push(performance.now() - t1);
      if (samples.length > 8) samples.shift();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  function capture(download) {
    draw();
    const label = makeLabel();
    const shot = shotLabel(canvas, label);
    ui.status.dataset.shot = label;
    if (download) {
      const a = document.createElement("a");
      a.href = shot.url;
      a.download = "370z-" + angleId + ".png";
      a.click();
    }
    return { label, url: shot.url, bright: shot.bright };
  }
  function captureBase() {
    const tint = X.shell.uniforms.tint.value;
    const rim = X.shell.uniforms.rim.value;
    const def = X._def || {};
    base = {
      paint: hex(tint),
      glow: hex(rim),
      grid: def.grid ? hex(def.grid) : "#3ee6ff",
      wheel: def.rimC ? hex(def.rimC) : "#4a4f57",
      caliper: "#d1121f"
    };
  }
  async function sweep() {
    const fails = [];
    const notes = [];
    const before = errors.length;
    sweeping = true;
    wantTurn = false;
    controls.autoRotate = false;
    compare = false;
    eqA = defaults();
    draw();
    captureBase();
    const tint0 = hex(X.shell.uniforms.tint.value);
    for (const model of catalog.models) {
      eqA = defaults();
      eqA.model = model.id;
      try {
        await ensureDraw();
      } catch (err) {
        fails.push("model " + model.id + " " + (err && err.message || err));
        continue;
      }
      const bad = model.kind === "xray" ? finiteCar() : scanGroup(shown.a);
      if (bad.length) fails.push("model " + model.id + " " + bad.slice(0, 4).join(","));
      if (model.kind !== "xray" && (!shown.a || shown.a.userData.modelId !== model.id)) fails.push("model " + model.id + " did not show");
    }
    eqA = defaults();
    await ensureDraw();
    for (const [slot, spec] of Object.entries(catalog.slots)) {
      if (slot === "model") continue;
      for (const item of spec.options) {
        eqA = defaults();
        eqA[slot] = item.id;
        try {
          draw();
        } catch (err) {
          fails.push(slot + "=" + item.id + " " + (err && err.message || err));
          continue;
        }
        const bad = finiteCar();
        if (bad.length) fails.push(slot + "=" + item.id + " " + bad.slice(0, 4).join(","));
      }
    }
    const mixed = defaults();
    mixed.paint = "pink";
    mixed.wheels = "gold";
    mixed.spoiler = "gtwing";
    mixed.caliper = "cyan";
    mixed.underglow = "pink";
    eqA = mixed;
    try {
      draw();
    } catch (err) {
      fails.push("mixed " + err.message);
    }
    eqA = defaults();
    await ensureDraw();
    draw();
    const tint1 = hex(X.shell.uniforms.tint.value);
    if (tint1 !== tint0) fails.push("paint leftover " + tint1 + " vs " + tint0);
    const stillen = X.kidParts && X.kidParts.stillen;
    if (stillen && stillen.visible && X.kidGrp && X.kidGrp.visible) fails.push("stillen leftover");
    const lines = designText();
    if (lines.some((l) => l.startsWith("FAIL"))) fails.push("design " + lines.filter((l) => l.startsWith("FAIL")).join(" | "));
    compare = true;
    eqB = defaults();
    eqB.paint = "cyan";
    const yaw = readOrbit().yaw;
    draw();
    if (Math.abs(readOrbit().yaw - yaw) > 0.02) fails.push("compare yaw drifted");
    compare = false;
    eqA = defaults();
    const shot = capture(false);
    const expect = makeLabel();
    if (shot.label !== expect) fails.push("label " + shot.label);
    if (!(shot.bright > 8)) fails.push("label pixels " + shot.bright);
    const fresh = errors.slice(before);
    for (const e of fresh) fails.push("error " + e);
    wantTurn = turn;
    controls.autoRotate = turn;
    sweeping = false;
    return { fails, notes, label: shot.label, errors: fresh };
  }
  function settings() {
    return { eqA: Object.assign({}, eqA), eqB: eqB ? Object.assign({}, eqB) : null, angle: angleId, compare, turn: wantTurn, edit };
  }
  async function setView(opts) {
    opts = opts || {};
    if (opts.eq) eqA = Object.assign(defaults(), opts.eq);
    if (opts.compare) {
      compare = true;
      ui.compareBtn.classList.add("on");
      eqB = Object.assign(defaults(), opts.eqB || { paint: "cyan" });
    } else if (opts.compare === false) {
      compare = false;
      ui.compareBtn.classList.remove("on");
    }
    if (opts.angle) {
      angleId = opts.angle;
      const angle = ANGLES.find((a) => a.id === opts.angle);
      if (angle) place(angle.yaw, angle.pitch, camera.position.distanceTo(controls.target) || 10.5);
    }
    if (opts.turn != null) {
      wantTurn = !!opts.turn;
      turn = wantTurn;
      controls.autoRotate = wantTurn;
    }
    refreshGui();
    paintChips();
    draw();
  }
  return {
    id: "car",
    title: "CAR & PAINT",
    async mount(container, context) {
      alive = true;
      host = container;
      ctx = context || { onSave() {
      } };
      unhook = hook();
      try {
        catalog = await fetchJson(devUrl("catalogs/car.json"));
        catalog.slots.model.options = catalog.models.map((m) => ({ id: m.id, name: m.name }));
        try {
          const res = await fetch(repoUrl(catalog.design.checker));
          checkerNote = res.ok ? "370Z design checker file is in this branch." : "Official 370Z design checker is not in this branch. The lines above are measured from the live Xray model.";
        } catch (err) {
          checkerNote = "Official 370Z design checker is not in this branch. The lines above are measured from the live Xray model.";
        }
        eqA = defaults();
        eqB = defaults();
        layout();
        X = await loadXray();
        if (!alive) return;
        draw();
        captureBase();
        designText();
        ui.status.textContent = "370Z \xB7 game shader";
        paintChips();
        if (pending) await setView(pending);
        pending = null;
        ready = true;
        if (window.__SPIN) window.__SPIN.car = { sweep, capture, setView, frames: () => samples.slice(), errors: () => errors.slice() };
        if (ctx.signal) ctx.signal.addEventListener("abort", () => this.unmount());
      } catch (err) {
        this.unmount();
        throw err;
      }
    },
    unmount() {
      alive = false;
      ready = false;
      try {
        unhook();
      } catch (err) {
      }
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      if (controls) controls.dispose();
      if (guestScene) {
        for (const child of guestScene.children.slice()) guestScene.remove(child);
      }
      if (guestRenderer) guestRenderer.dispose();
      guestRenderer = null;
      guestScene = null;
      shown.a = null;
      shown.b = null;
      if (gui) gui.destroy();
      if (ui.obs) ui.obs.disconnect();
      controls = null;
      gui = null;
      canvas = null;
      if (host) host.innerHTML = "";
    },
    save() {
      return settings();
    },
    load(s) {
      if (!ready) pending = s;
      else setView(s);
    }
  };
}
export {
  createModule
};
